import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {protectedProcedure} from '../../middleware/protected.mjs';
import {omit, pick} from 'es-toolkit';
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
            .leftJoin('petition_votes', (join) =>
                join
                    .onRef('petitions.id', '=', 'petition_votes.petition_id')
                    .on(
                        'petition_votes.user_id',
                        '=',
                        `${ctx.auth?.user_id ?? 0}`,
                    ),
            )
            .select([
                'petitions.id',
                'petitions.title',
                'petitions.description',
                'petitions.location',
                'petitions.target',
                'petitions.created_at',
                'petitions.created_by',
                'petitions.submitted_at',
                'petitions.rejected_at',
                'petitions.rejection_reason',
                'petitions.approved_at',
                'petitions.formalized_at',
                'petition_votes.vote as user_vote',
            ])
            .where('petitions.id', '=', input.id)
            .where('petitions.deleted_at', 'is', null)
            .executeTakeFirst();

        if (!result) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        const user = await ctx.services.postgresQueryBuilder
            .selectFrom('users')
            .selectAll()
            .where('id', '=', `${result.created_by}`)
            .executeTakeFirst();

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

        const downvoteResult = await countVotes(-1);
        const downvotes = Number(`${downvoteResult?.votes ?? 0}`);

        const attachments = await ctx.services.postgresQueryBuilder
            .selectFrom('petition_attachments')
            .selectAll()
            .where('petition_id', '=', input.id)
            .execute();

        return {
            data: {
                ...omit(result, ['user_vote']),
                petition_upvote_count: upvotes,
                petition_downvote_count: downvotes,
                status: deriveStatus(result),
                attachments: await Promise.all(
                    attachments.map(async (attachment) => ({
                        ...pick(attachment, ['id', 'filename', 'created_at']),
                        type: attachment.is_image ? 'image' : 'file',
                        thumbnail: attachment.thumbnail
                            ? await ctx.services.fileStorage.getFileURL(
                                  attachment.thumbnail,
                              )
                            : null,
                        attachment: await ctx.services.fileStorage.getFileURL(
                            attachment.attachment,
                        ),
                    })),
                ),
            },
            extras: {
                user_vote: result.user_vote,
                user: pick(user!!, ['id', 'name', 'picture']),
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
            also_submit: z.boolean().default(false),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .selectAll()
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        if (
            `${petition.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-petition',
            });
        }

        await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                ...pick(input.data, [
                    'title',
                    'location',
                    'target',
                    'description',
                ]),
                rejected_at: null,
                rejection_reason: null,
                approved_at: null,
                moderated_by: null,

                formalized_at: null,
                formalized_by: null,
                ...(input.also_submit
                    ? {
                          submitted_at: new Date(),
                      }
                    : {
                          submitted_at: null,
                      }),
            })
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
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .selectAll()
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        if (
            `${petition.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-petition',
            });
        }

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
            petition_id: z.number(),
            attachment_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .selectAll()
            .where('id', '=', `${input.petition_id}`)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        if (
            `${petition.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-petition',
            });
        }

        await ctx.services.postgresQueryBuilder
            .deleteFrom('petition_attachments')
            .where('petition_id', '=', `${input.petition_id}`)
            .where('id', '=', `${input.attachment_id}`)
            .executeTakeFirst();

        return {
            message: 'removed',
        };
    });

export const remove = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .selectAll()
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        if (
            `${petition.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-petition',
            });
        }

        const deleted = await ctx.services.postgresQueryBuilder
            .with('deleted', (db) => {
                return db
                    .deleteFrom('petitions')
                    .where('id', '=', `${input.id}`)
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

export const softDeletePetition = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .selectAll()
            .where('id', '=', `${input.id}`)
            .where('deleted_at', 'is', null)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        if (
            `${petition.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-petition',
            });
        }

        await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                deleted_at: new Date(),
            })
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        return {
            input,
            message: 'petition soft deleted',
        };
    });
