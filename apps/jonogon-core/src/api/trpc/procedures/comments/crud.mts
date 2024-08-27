import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {protectedProcedure} from '../../middleware/protected.mjs';

export const listComments = publicProcedure
    .input(
        z.object({
            petition_id: z.string(),
            parent_id: z.string().optional(),
        }),
    )
    .query(async ({input, ctx}) => {
        const commentQuery = scope(
            ctx.services.postgresQueryBuilder
                .selectFrom('comments')
                .innerJoin('users', 'comments.created_by', 'users.id')
                .leftJoin(
                    'comment_votes',
                    'comments.id',
                    'comment_votes.comment_id',
                )
                .leftJoin(
                    'comment_votes as user_vote', // Alias the join for the specific user's vote
                    (join) =>
                        join
                            .onRef('comments.id', '=', 'user_vote.comment_id')
                            .on(
                                'user_vote.user_id',
                                '=',
                                `${ctx.auth?.user_id}`,
                            ),
                )
                .select(({fn}) => [
                    'users.username as username',
                    'users.id as user_id',
                    'users.picture as profile_picture',
                    'comments.created_by',
                    'comments.parent_id',
                    'comments.id',
                    'comments.body',
                    'comments.highlighted_at',
                    'comments.deleted_at',
                    fn.sum('comment_votes.vote').as('total_votes'),
                    'user_vote.vote as user_vote',
                ])
                .groupBy(['user_vote.vote', 'users.id', 'comments.id'])
                .where('comments.petition_id', '=', `${input.petition_id}`),
        ).let((query) => {
            if (input.parent_id == '-1') {
                return query
                    .where('comments.parent_id', 'is not', null)
                    .orderBy('comments.created_at', 'asc');
            } else {
                return query
                    .where('comments.parent_id', 'is', null)
                    .orderBy('total_votes', 'asc');
            }
        });

        const comments = await commentQuery.execute();

        const data = await Promise.all(
            comments.map(async (comment) => {
                if (comment.deleted_at !== null) {
                    return {
                        ...comment,
                        body: '(deleted)',
                        profile_picture: comment.profile_picture
                            ? await ctx.services.fileStorage.getFileURL(
                                  comment.profile_picture,
                              )
                            : null,
                        total_votes: Number(comment.total_votes),
                    };
                } else {
                    return {
                        ...comment,
                        profile_picture: comment.profile_picture
                            ? await ctx.services.fileStorage.getFileURL(
                                  comment.profile_picture,
                              )
                            : null,
                        total_votes: Number(comment.total_votes),
                    };
                }
            }),
        );

        return {data};
    });

export const createComment = protectedProcedure
    .input(
        z.object({
            body: z.string(),
            parent_id: z.string().optional(),
            petition_id: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const getDepth = async () => {
            if (input.parent_id) {
                const parentComment = await ctx.services.postgresQueryBuilder
                    .selectFrom('comments')
                    .select(['comments.depth', 'comments.petition_id'])
                    .where('comments.id', '=', `${input.parent_id}`)
                    .executeTakeFirst();

                if (!parentComment) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'failed-to-find-parent-comment',
                    });
                }

                if (parentComment.petition_id !== input.petition_id) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'parent-comment-in-different-petition',
                    });
                }

                return parentComment.depth + 1;
            } else {
                return 0;
            }
        };

        const depth = await getDepth();

        const created = await ctx.services.postgresQueryBuilder
            .insertInto('comments')
            .values({
                body: input.body,
                parent_id: input.parent_id ?? null,
                created_by: ctx.auth.user_id,
                petition_id: input.petition_id,
                depth: depth,
            })
            .returning(['comments.id'])
            .executeTakeFirst();

        return {
            data: created,
        };
    });

export const deleteComment = protectedProcedure
    .input(
        z.object({
            id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const comment = await ctx.services.postgresQueryBuilder
            .selectFrom('comments')
            .selectAll()
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        if (!comment) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'comment-not-found',
            });
        }

        if (
            `${comment.created_by}` !== `${ctx.auth.user_id}` &&
            !ctx.auth.is_user_admin
        ) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'not-your-comment',
            });
        }

        await ctx.services.postgresQueryBuilder
            .updateTable('comments')
            .set({
                deleted_by: ctx.auth.user_id,
                deleted_at: new Date(),
            })
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        return {input, message: 'deleted'};
    });
