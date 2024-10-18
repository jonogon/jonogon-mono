import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';

export const vote = protectedProcedure
    .input(
        z.object({
            comment_id: z.string(),
            vote: z.union([z.literal('up'), z.literal('down')]),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .insertInto('comment_votes')
            .values({
                comment_id: input.comment_id,
                user_id: ctx.auth.user_id,
                vote: input.vote == 'up' ? 1 : -1,
            })
            .onConflict((conflict) =>
                conflict
                    .constraint('comment_votes__by_user_on_comment')
                    .doUpdateSet({
                        vote: input.vote === 'up' ? 1 : -1,
                        updated_at: new Date(),
                    }),
            )
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            const comment = await ctx.services.postgresQueryBuilder
                .selectFrom('comments')
                .where('id', '=', `${input.comment_id}`)
                .select(['id', 'created_by', 'parent_id', 'petition_id'])
                .executeTakeFirst();

            if (comment) {
                await ctx.services.postgresQueryBuilder
                    .insertInto('notifications')
                    .values(
                        comment.parent_id
                            ? {
                                  user_id: comment.created_by,
                                  type: 'reply_vote',
                                  actor_user_id: ctx.auth.user_id,
                                  comment_id: comment.parent_id,
                                  reply_comment_id: comment.id,
                                  petition_id: comment.petition_id,
                                  comment_vote_id: result.id,
                                  meta: {
                                      vote: input.vote === 'up' ? 1 : -1,
                                  },
                              }
                            : {
                                  user_id: comment.created_by,
                                  type: 'comment_vote',
                                  actor_user_id: ctx.auth.user_id,
                                  comment_id: comment.id,
                                  petition_id: comment.petition_id,
                                  comment_vote_id: result.id,
                                  meta: {
                                      vote: input.vote === 'up' ? 1 : -1,
                                  },
                              },
                    )
                    .executeTakeFirst();
            }
        }

        return {
            input,
            message: 'voted',
        };
    });

export const clearVote = protectedProcedure
    .input(
        z.object({
            comment_id: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .deleteFrom('comment_votes')
            .where('comment_id', '=', `${input.comment_id}`)
            .where('user_id', '=', `${ctx.auth.user_id}`)
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .deleteFrom('notifications')
                .where('comment_vote_id', '=', `${result.id}`)
                .execute();
        }

        return {
            input,
            message: 'vote-cleared',
        };
    });
