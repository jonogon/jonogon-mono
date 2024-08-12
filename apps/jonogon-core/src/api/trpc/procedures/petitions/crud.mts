import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {protectedProcedure} from '../../middleware/protected.mjs';
import {pick} from 'es-toolkit';
import {deriveStatus} from '../../../../db/model-utils/petition.mjs';

export const getPetition = publicProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .query(async ({input, ctx}) => {
        // TODO: don't return privileged info if not user's own petition or if not logged in
        //       don't return non-listed petitions unless it's user's own

        const result = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select([
                'id',
                'title',
                'location',
                'target',
                'created_at',
                'created_by',
                'submitted_at',
                'rejected_at',
                'rejection_reason',
                'approved_at',
                'formalized_at',
            ])
            .where('id', '=', input.id)
            .executeTakeFirst();

        if (!result) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        async function countVotes(vote: -1 | 1) {
            return await ctx.services.postgresQueryBuilder
                .selectFrom('petition_votes')
                .select(({fn}) => [fn.count('id').as('votes')])
                .where('petition_id', '=', input.id)
                .where('vote', '=', vote)
                .executeTakeFirst();
        }

        const upvoteResult = await countVotes(1);
        const upvotes = Number(`${upvoteResult?.votes ?? 0}`);

        const downvoteResult = await countVotes(1);
        const downvotes = Number(`${downvoteResult?.votes ?? 0}`);

        return {
            data: {
                ...result,
                petition_upvote_count: upvotes,
                petition_downvote_count: downvotes,
                status: deriveStatus(result),
            },
        };
    });

export const createPetition = protectedProcedure.mutation(
    async ({input, ctx}) => {
        const existingDraft = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select(['petitions.id'])
            .where('created_by', '=', `${ctx.auth.user_id}`)
            .where('submitted_at', 'is', null)
            .executeTakeFirst();

        if (existingDraft) {
            return {
                data: existingDraft,
            };
        }

        const created = await ctx.services.postgresQueryBuilder
            .insertInto('petitions')
            .values({
                created_by: ctx.auth.user_id,
            })
            .returning(['petitions.id'])
            .executeTakeFirst();

        if (!created) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'failed-to-create-petition',
            });
        }

        return {
            data: created,
        };
    },
);

export const updatePetition = protectedProcedure
    .input(
        z.object({
            id: z.number(),
            data: z
                .object({
                    title: z.string(),
                    location: z.string(),
                    target: z.string(),
                    description: z.string(),
                })
                .partial(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // TODO: check if the user is an admin, or if the petition is the user's own

        await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set(
                pick(input.data, [
                    'title',
                    'location',
                    'target',
                    'description',
                ]),
            )
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        return {
            input,
            message: 'updated',
        };
    });

export const submitPetition = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                submitted_at: new Date(),
            })
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        return {
            input,
            message: 'submitted',
        };
    });

export const removeAttachment = protectedProcedure
    .input(
        z.object({
            id: z.number(),
            image_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // remove the attachment that is tagged
        // as long as the petition is the user's own or user is admin
    });

export const remove = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const deleted = await ctx.services.postgresQueryBuilder
            .with('deleted', (db) => {
                return db
                    .deleteFrom('petitions')
                    .where('id', '=', `${input.id}`)
                    .where('created_by', '=', `${ctx.auth.user_id}`)
                    .returningAll();
            })
            .selectFrom('deleted')
            .select(({fn}) => [fn.countAll().as('count')])
            .executeTakeFirst();

        if (!deleted?.count) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        return {input, data: deleted, message: 'deleted'};
    });
