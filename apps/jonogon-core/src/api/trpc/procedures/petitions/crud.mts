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
                `petitions.flagged_at`,
                `petitions.flagged_reason`,
                'petitions.approved_at',
                'petitions.formalized_at',
                'petition_votes.vote as user_vote',
                'petitions.upvote_target as upvote_target',
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

export const createPetition = protectedProcedure
    .input(
        z
            .object({
                loggedOutDraft: z
                    .object({
                        title: z.string(),
                        location: z.string(),
                        target: z.string(),
                        description: z.string(),
                    })
                    .partial(),
            })
            .optional(),
    )
    .mutation(async ({input, ctx}) => {
        if (!input) {
            const existingDraft = await ctx.services.postgresQueryBuilder
                .selectFrom('petitions')
                .select(['petitions.id'])
                .where('created_by', '=', `${ctx.auth.user_id}`)
                .where('submitted_at', 'is', null)
                .where('deleted_at', 'is', null)
                .orderBy('created_at', 'desc')
                .executeTakeFirst();

            if (existingDraft) {
                return {
                    data: existingDraft,
                };
            }
        }

        const created = await ctx.services.postgresQueryBuilder
            .insertInto('petitions')
            .values(
                !input
                    ? {
                          created_by: ctx.auth.user_id,
                          score: 0,
                          log_score: 0,
                      }
                    : {
                          created_by: ctx.auth.user_id,
                          score: 0,
                          log_score: 0,
                          ...pick(input.loggedOutDraft, [
                              'title',
                              'location',
                              'target',
                              'description',
                          ]),
                      },
            )
            .returning(['petitions.id'])
            .executeTakeFirst();

        if (!created) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'failed-to-create-petition',
            });
        }

        const upvote = await ctx.services.postgresQueryBuilder
            .insertInto('petition_votes')
            .values({
                petition_id: created.id,
                user_id: ctx.auth.user_id,
                vote: 1, // Upvote
            })
            .executeTakeFirst();

        if (!upvote) {
            await ctx.services.postgresQueryBuilder
                .deleteFrom('petitions')
                .where('id', '=', `${created.id}`)
                .executeTakeFirst();

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'failed-to-upvote-petition',
            });
        }

        return {
            data: created,
        };
    });

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

export const softDeletePetition = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // Check if the petition exists
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

        // Check if the user is authorized to delete the petition
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
            message: 'petition-soft-deleted',
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

export const getOgImageDetails = publicProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .query(async ({input, ctx}) => {
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select([
                'petitions.title',
                'petitions.location',
                'petitions.target',
                'petitions.created_at',
                'petitions.created_by',
            ])
            .where('petitions.id', '=', input.id)
            .where('petitions.deleted_at', 'is', null)
            .executeTakeFirst();

        if (!petition) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'petition-not-found',
            });
        }

        const upvoteCount = await ctx.services.postgresQueryBuilder
            .selectFrom('petition_votes')
            .select(({fn}) => [fn.count('id').as('count')])
            .where('petition_id', '=', input.id)
            .where('vote', '=', 1)
            .executeTakeFirst();

        const downvoteCount = await ctx.services.postgresQueryBuilder
            .selectFrom('petition_votes')
            .select(({fn}) => [fn.count('id').as('count')])
            .where('petition_id', '=', input.id)
            .where('vote', '=', -1)
            .executeTakeFirst();

        const commentCount = await ctx.services.postgresQueryBuilder
            .selectFrom('comments')
            .select(({fn}) => [fn.count('id').as('count')])
            .where('petition_id', '=', input.id)
            .where('deleted_at', 'is', null)
            .executeTakeFirst();

        const mainImage = await ctx.services.postgresQueryBuilder
            .selectFrom('petition_attachments')
            .select('attachment')
            .where('petition_id', '=', input.id)
            .where('is_image', '=', true)
            .where('deleted_at', 'is', null)
            .orderBy('created_at', 'asc')
            .limit(1)
            .executeTakeFirst();

        const user = await ctx.services.postgresQueryBuilder
            .selectFrom('users')
            .select(['id', 'name', 'picture'])
            .where('id', '=', `${petition.created_by}`)
            .executeTakeFirst();

        const formattedDate = new Date(petition.created_at).toLocaleDateString(
            'en-GB',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            },
        );

        return {
            data: {
                title: petition.title,
                location: petition.location,
                target: petition.target,
                created_at: formattedDate,
                petition_upvote_count: Number(upvoteCount?.count ?? 0),
                petition_downvote_count: Number(downvoteCount?.count ?? 0),
                petition_comments_count: Number(commentCount?.count ?? 0),
                main_image: mainImage?.attachment ?? null,
                created_by_id: user?.id ?? null,
                created_by_name: user?.name ?? null,
                created_by_image: user?.picture ?? null,
            },
        };
    });
