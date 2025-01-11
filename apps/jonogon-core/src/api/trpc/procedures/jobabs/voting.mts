import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';

export const vote = protectedProcedure
    .input(
        z.object({
            jobab_id: z.number(),
            vote: z.union([z.literal('up'), z.literal('down')]),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .insertInto('jobab_votes')
            .values({
                jobab_id: input.jobab_id,
                user_id: BigInt(ctx.auth!.user_id),
                vote: input.vote === 'up' ? 1 : -1,
            })
            .onConflict((conflict) =>
                conflict
                    .constraint('jobab_votes__by_user_on_jobab')
                    .doUpdateSet({
                        vote: input.vote === 'up' ? 1 : -1,
                        updated_at: new Date(),
                    }),
            )
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            const jobab = await ctx.services.postgresQueryBuilder
                .selectFrom('jobabs')
                .where('id', '=', `${input.jobab_id}`)
                .select(['created_by'])
                .executeTakeFirst();

            if (jobab) {
                await ctx.services.postgresQueryBuilder
                    .transaction()
                    .execute(async (t) => {
                        await t
                            .deleteFrom('notifications')
                            .where('type', '=', 'jobab_vote')
                            .where('vote_id', '=', result.id)
                            .execute();

                        await t
                            .insertInto('notifications')
                            .values({
                                user_id: jobab.created_by,
                                type: 'jobab_vote',
                                actor_user_id: ctx.auth!.user_id,
                                jobab_id: `${input.jobab_id}`,
                                vote_id: result.id,
                                meta: {
                                    vote: input.vote === 'up' ? 1 : -1,
                                },
                            })
                            .executeTakeFirst();
                    });
            }
        }

        return {
            message: 'voted',
        };
    });

export const clearVote = protectedProcedure
    .input(
        z.object({
            jobab_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .deleteFrom('jobab_votes')
            .where('jobab_id', '=', `${input.jobab_id}`)
            .where('user_id', '=', `${ctx.auth!.user_id}`)
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .deleteFrom('notifications')
                .where('type', '=', 'jobab_vote')
                .where('vote_id', '=', result.id)
                .execute();
        }

        return {
            message: 'vote-cleared',
        };
    });

export const commentVote = protectedProcedure
    .input(
        z.object({
            comment_id: z.number(),
            vote: z.union([z.literal('up'), z.literal('down')]),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .insertInto('jobab_comment_votes')
            .values({
                comment_id: input.comment_id,
                user_id: BigInt(ctx.auth!.user_id),
                vote: input.vote === 'up' ? 1 : -1,
            })
            .onConflict((conflict) =>
                conflict
                    .constraint('jobab_comment_votes__by_user_on_comment')
                    .doUpdateSet({
                        vote: input.vote === 'up' ? 1 : -1,
                        updated_at: new Date(),
                    }),
            )
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            const comment = await ctx.services.postgresQueryBuilder
                .selectFrom('jobab_comments')
                .where('id', '=', `${input.comment_id}`)
                .select(['created_by'])
                .executeTakeFirst();

            if (comment) {
                await ctx.services.postgresQueryBuilder
                    .transaction()
                    .execute(async (t) => {
                        await t
                            .deleteFrom('notifications')
                            .where('type', '=', 'jobab_comment_vote')
                            .where('comment_vote_id', '=', result.id)
                            .execute();

                        await t
                            .insertInto('notifications')
                            .values({
                                user_id: comment.created_by,
                                type: 'jobab_comment_vote',
                                actor_user_id: ctx.auth!.user_id,
                                comment_id: `${input.comment_id}`,
                                comment_vote_id: result.id,
                                meta: {
                                    vote: input.vote === 'up' ? 1 : -1,
                                },
                            })
                            .executeTakeFirst();
                    });
            }
        }

        return {
            message: 'voted',
        };
    });

export const clearCommentVote = protectedProcedure
    .input(
        z.object({
            comment_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .deleteFrom('jobab_comment_votes')
            .where('comment_id', '=', `${input.comment_id}`)
            .where('user_id', '=', `${ctx.auth!.user_id}`)
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .deleteFrom('notifications')
                .where('type', '=', 'jobab_comment_vote')
                .where('comment_vote_id', '=', result.id)
                .execute();
        }

        return {
            message: 'vote-cleared',
        };
    });
