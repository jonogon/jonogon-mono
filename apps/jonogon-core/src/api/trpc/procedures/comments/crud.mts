import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {protectedProcedure} from '../../middleware/protected.mjs';

export const listComments = publicProcedure
    .input(
        z.object({
            petition_id: z.string(),
        }),
    )
    .query(async ({input, ctx}) => {
        // TODO: if the response is ok, maybe turn it into a tree before sending back
        const comments = await ctx.services.postgresQueryBuilder
            .selectFrom('comments')
            .innerJoin('users', 'comments.user_id', 'users.id')
            .leftJoin(
                'comment_votes',
                'comments.id',
                'comment_votes.comment_id',
            )
            .select(({fn}) => [
                'users.name',
                'users.id',
                'comments.id',
                'comments.body',
                fn.sum('comment_votes.vote').as('total_votes'),
            ])
            .groupBy(['users.id', 'comments.id'])
            .where('comments.petition_id', '=', `${input.petition_id}`)
            .execute();

        return {
            data: comments,
        };
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
                    .select(['comments.depth'])
                    .where('comments.id', '=', `${input.parent_id}`)
                    .executeTakeFirst();

                if (!parentComment) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'failed-to-find-parent-comment',
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
                user_id: ctx.auth.user_id,
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
            `${comment.user_id}` !== `${ctx.auth.user_id}` &&
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
                is_deleted: true,
                deleted_by: ctx.auth.user_id,
                deleted_at: new Date(),
            })
            .where('id', '=', `${input.id}`)
            .executeTakeFirst();

        return {input, message: 'deleted'};
    });
