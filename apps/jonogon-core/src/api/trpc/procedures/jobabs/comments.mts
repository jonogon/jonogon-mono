import {protectedProcedure} from '../../middleware/protected.mjs';
import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {sql} from 'kysely';
import type {DB} from '../../../../db/postgres/types.mjs';

const COMMENTS_PER_PAGE = 8;
const REPLIES_PER_PAGE = 4;

type Context = {
    services: {
        fileStorage: {
            getFileURL: (path: string) => Promise<string>;
        };
    };
};

type Comment = {
    profile_picture: string | null;
    total_votes: string | number;
    [key: string]: any;
};

async function processCommentUrls(comments: Comment[], ctx: Context) {
    return Promise.all(
        comments.map(async (comment) => ({
            ...comment,
            profile_picture: comment.profile_picture
                ? await ctx.services.fileStorage.getFileURL(
                      comment.profile_picture,
                  )
                : null,
            total_votes: Number(comment.total_votes),
        })),
    );
}

const withVotes = (qb: any, userId?: string) => {
    qb = qb.leftJoin('jobab_comment_votes', (join: any) =>
        join.onRef('jobab_comments.id', '=', 'jobab_comment_votes.comment_id'),
    );

    if (userId) {
        qb = qb.leftJoin('jobab_comment_votes as user_vote', (join: any) =>
            join
                .onRef('jobab_comments.id', '=', 'user_vote.comment_id')
                .on('user_vote.user_id', '=', userId),
        );
    }

    return qb;
};

const baseCommentQuery = (qb: any, jobabId: number) =>
    qb
        .selectFrom('jobab_comments')
        .innerJoin('users', 'jobab_comments.created_by', 'users.id')
        .where('jobab_comments.jobab_id', '=', `${jobabId}`)
        .where('jobab_comments.deleted_at', 'is', null);

const getCommentFields = () => [
    'users.name as username',
    'users.id as user_id',
    'users.picture as profile_picture',
    'jobab_comments.created_by',
    'jobab_comments.parent_id',
    'jobab_comments.id',
    'jobab_comments.body',
    'jobab_comments.highlighted_at',
    'jobab_comments.deleted_at',
    'jobab_comments.created_at',
    sql<number>`COALESCE(SUM(jobab_comment_votes.vote), 0)`.as('total_votes'),
];

export const countAllComments = publicProcedure
    .input(z.object({jobab_id: z.number()}))
    .query(async ({input, ctx}) => {
        const result = await baseCommentQuery(
            ctx.services.postgresQueryBuilder,
            input.jobab_id,
        )
            .select((eb: any) => eb.fn.count('jobab_comments.id').as('count'))
            .executeTakeFirst();

        return {data: {count: Number(result?.count ?? 0)}};
    });

export const countRootComments = publicProcedure
    .input(z.object({jobab_id: z.number()}))
    .query(async ({input, ctx}) => {
        const result = await baseCommentQuery(
            ctx.services.postgresQueryBuilder,
            input.jobab_id,
        )
            .where('jobab_comments.parent_id', 'is', null)
            .select((eb: any) => eb.fn.count('jobab_comments.id').as('count'))
            .executeTakeFirst();

        return {data: {count: Number(result?.count ?? 0)}};
    });

export const countReplies = publicProcedure
    .input(z.object({jobab_id: z.number(), parent_id: z.number()}))
    .query(async ({input, ctx}) => {
        const result = await baseCommentQuery(
            ctx.services.postgresQueryBuilder,
            input.jobab_id,
        )
            .where('jobab_comments.parent_id', '=', `${input.parent_id}`)
            .select((eb: any) => eb.fn.count('jobab_comments.id').as('count'))
            .executeTakeFirst();

        return {data: {count: Number(result?.count ?? 0)}};
    });

export const listPublicComments = publicProcedure
    .input(
        z.object({
            jobab_id: z.number(),
            page: z.number(),
        }),
    )
    .query(async ({input, ctx}) => {
        const comments = await withVotes(
            baseCommentQuery(ctx.services.postgresQueryBuilder, input.jobab_id),
        )
            .select(getCommentFields())
            .where('jobab_comments.parent_id', 'is', null)
            .groupBy(['users.id', 'jobab_comments.id'])
            .orderBy('total_votes', 'desc')
            .orderBy('jobab_comments.created_at', 'asc')
            .limit(COMMENTS_PER_PAGE)
            .offset((input.page - 1) * COMMENTS_PER_PAGE)
            .execute();

        return {
            data: await processCommentUrls(comments, ctx),
        };
    });

export const listComments = publicProcedure
    .input(
        z.object({
            jobab_id: z.number(),
            page: z.number(),
            limit: z.number().optional(),
        }),
    )
    .query(async ({input, ctx}) => {
        const {jobab_id, page, limit = 10} = input;
        const offset = (page - 1) * limit;

        // Base query for both authenticated and unauthenticated users
        const baseQuery = ctx.services.postgresQueryBuilder
            .selectFrom('jobab_comments')
            .innerJoin('users', 'jobab_comments.created_by', 'users.id')
            .leftJoin(
                'jobab_comment_votes',
                'jobab_comments.id',
                'jobab_comment_votes.comment_id',
            )
            .select([
                'users.name as username',
                'users.id as user_id',
                'users.picture as profile_picture',
                'jobab_comments.created_by',
                'jobab_comments.parent_id',
                'jobab_comments.id',
                'jobab_comments.body',
                'jobab_comments.highlighted_at',
                'jobab_comments.deleted_at',
                'jobab_comments.created_at',
                sql<number>`COALESCE(SUM(jobab_comment_votes.vote), 0)`.as(
                    'total_votes',
                ),
            ])
            .where('jobab_comments.jobab_id', '=', `${jobab_id}`)
            .where('jobab_comments.deleted_at', 'is', null);

        // Get root comments first
        const rootComments = ctx.auth?.user_id
            ? await baseQuery
                  .where('jobab_comments.parent_id', 'is', null)
                  .leftJoin('jobab_comment_votes as user_vote', (join) =>
                      join
                          .onRef(
                              'jobab_comments.id',
                              '=',
                              'user_vote.comment_id',
                          )
                          .on('user_vote.user_id', '=', `${ctx.auth!.user_id}`),
                  )
                  .select('user_vote.vote as user_vote')
                  .groupBy(['users.id', 'jobab_comments.id', 'user_vote.vote'])
                  .orderBy('jobab_comments.created_at', 'desc')
                  .orderBy('total_votes', 'desc')
                  .limit(limit)
                  .offset(offset)
                  .execute()
            : await baseQuery
                  .where('jobab_comments.parent_id', 'is', null)
                  .select(sql<null>`NULL`.as('user_vote'))
                  .groupBy(['users.id', 'jobab_comments.id'])
                  .orderBy('jobab_comments.created_at', 'desc')
                  .orderBy('total_votes', 'desc')
                  .limit(limit)
                  .offset(offset)
                  .execute();

        // Get second layer replies
        const rootCommentIds = rootComments.map((comment) => comment.id);
        const secondLayerReplies =
            rootCommentIds.length > 0
                ? ctx.auth?.user_id
                    ? await baseQuery
                          .where(
                              'jobab_comments.parent_id',
                              'in',
                              rootCommentIds,
                          )
                          .leftJoin(
                              'jobab_comment_votes as user_vote',
                              (join) =>
                                  join
                                      .onRef(
                                          'jobab_comments.id',
                                          '=',
                                          'user_vote.comment_id',
                                      )
                                      .on(
                                          'user_vote.user_id',
                                          '=',
                                          `${ctx.auth!.user_id}`,
                                      ),
                          )
                          .select('user_vote.vote as user_vote')
                          .groupBy([
                              'users.id',
                              'jobab_comments.id',
                              'user_vote.vote',
                          ])
                          .orderBy('jobab_comments.created_at', 'asc')
                          .execute()
                    : await baseQuery
                          .where(
                              'jobab_comments.parent_id',
                              'in',
                              rootCommentIds,
                          )
                          .select(sql<null>`NULL`.as('user_vote'))
                          .groupBy(['users.id', 'jobab_comments.id'])
                          .orderBy('jobab_comments.created_at', 'asc')
                          .execute()
                : [];

        // Get third layer replies
        const secondLayerIds = secondLayerReplies.map((comment) => comment.id);
        const thirdLayerReplies =
            secondLayerIds.length > 0
                ? ctx.auth?.user_id
                    ? await baseQuery
                          .where(
                              'jobab_comments.parent_id',
                              'in',
                              secondLayerIds,
                          )
                          .leftJoin(
                              'jobab_comment_votes as user_vote',
                              (join) =>
                                  join
                                      .onRef(
                                          'jobab_comments.id',
                                          '=',
                                          'user_vote.comment_id',
                                      )
                                      .on(
                                          'user_vote.user_id',
                                          '=',
                                          `${ctx.auth!.user_id}`,
                                      ),
                          )
                          .select('user_vote.vote as user_vote')
                          .groupBy([
                              'users.id',
                              'jobab_comments.id',
                              'user_vote.vote',
                          ])
                          .orderBy('jobab_comments.created_at', 'asc')
                          .execute()
                    : await baseQuery
                          .where(
                              'jobab_comments.parent_id',
                              'in',
                              secondLayerIds,
                          )
                          .select(sql<null>`NULL`.as('user_vote'))
                          .groupBy(['users.id', 'jobab_comments.id'])
                          .orderBy('jobab_comments.created_at', 'asc')
                          .execute()
                : [];

        // Process URLs for all comments
        const [
            processedRootComments,
            processedSecondLayer,
            processedThirdLayer,
        ] = await Promise.all([
            processCommentUrls(rootComments, ctx),
            processCommentUrls(secondLayerReplies, ctx),
            processCommentUrls(thirdLayerReplies, ctx),
        ]);

        return {
            data: [
                ...processedRootComments,
                ...processedSecondLayer,
                ...processedThirdLayer,
            ],
        };
    });

export const listReplies = publicProcedure
    .input(
        z.object({
            jobab_id: z.number(),
            parent_id: z.number(),
            page: z.number(),
        }),
    )
    .query(async ({input, ctx}) => {
        const userId = ctx.auth?.user_id;
        const replies = await withVotes(
            baseCommentQuery(ctx.services.postgresQueryBuilder, input.jobab_id),
            userId ? `${userId}` : undefined,
        )
            .select([
                ...getCommentFields(),
                ...(userId ? ['user_vote.vote as user_vote'] : []),
                ...(userId
                    ? [
                          sql`CASE WHEN jobab_comments.created_by = ${userId} THEN TRUE ELSE FALSE END`.as(
                              'is_author',
                          ),
                      ]
                    : []),
            ])
            .where('jobab_comments.parent_id', '=', `${input.parent_id}`)
            .groupBy([
                'users.id',
                'jobab_comments.id',
                ...(userId ? ['user_vote.vote', 'is_author'] : []),
            ])
            .orderBy('jobab_comments.created_at', 'asc')
            .limit(REPLIES_PER_PAGE)
            .offset((input.page - 1) * REPLIES_PER_PAGE)
            .execute();

        return {
            data: await processCommentUrls(replies, ctx),
        };
    });

export const createComment = protectedProcedure
    .input(
        z.object({
            jobab_id: z.number(),
            parent_id: z.number().optional(),
            body: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // If parent_id is provided, verify it exists and is not deleted
        if (input.parent_id) {
            const parentComment = await baseCommentQuery(
                ctx.services.postgresQueryBuilder,
                input.jobab_id,
            )
                .select(['created_by'])
                .where('jobab_comments.id', '=', `${input.parent_id}`)
                .executeTakeFirst();

            if (!parentComment) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Parent comment not found or was deleted',
                });
            }
        }

        const comment = await ctx.services.postgresQueryBuilder
            .insertInto('jobab_comments')
            .values({
                jobab_id: `${input.jobab_id}`,
                parent_id: input.parent_id ? `${input.parent_id}` : null,
                body: input.body,
                created_by: BigInt(ctx.auth!.user_id),
            })
            .returning(['id'])
            .executeTakeFirst();

        // Get jobab creator to notify them
        const jobab = await ctx.services.postgresQueryBuilder
            .selectFrom('jobabs')
            .select(['created_by'])
            .where('id', '=', `${input.jobab_id}`)
            .executeTakeFirst();

        if (jobab) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: jobab.created_by,
                    type: 'jobab_comment',
                    actor_user_id: ctx.auth!.user_id,
                    jobab_id: `${input.jobab_id}`,
                })
                .execute();
        }

        // Create notification for comment owner if reply
        if (input.parent_id) {
            const parentComment = await ctx.services.postgresQueryBuilder
                .selectFrom('jobab_comments')
                .select(['created_by'])
                .where('id', '=', `${input.parent_id}`)
                .executeTakeFirst();

            if (parentComment) {
                await ctx.services.postgresQueryBuilder
                    .insertInto('notifications')
                    .values({
                        user_id: parentComment.created_by,
                        type: 'jobab_comment_reply',
                        actor_user_id: ctx.auth!.user_id,
                        jobab_id: `${input.jobab_id}`,
                    })
                    .execute();
            }
        }

        return {
            data: {
                id: comment!.id,
            },
            message: 'Comment created successfully',
        };
    });

export const updateComment = protectedProcedure
    .input(
        z.object({
            id: z.number(),
            body: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const comment = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_comments')
            .select(['created_by'])
            .where('id', '=', `${input.id}`)
            .where('deleted_at', 'is', null)
            .executeTakeFirst();

        if (!comment) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Comment not found',
            });
        }

        if (BigInt(comment.created_by) !== BigInt(ctx.auth!.user_id)) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You can only edit your own comments',
            });
        }

        await ctx.services.postgresQueryBuilder
            .updateTable('jobab_comments')
            .set({body: input.body})
            .where('id', '=', `${input.id}`)
            .execute();

        return {
            message: 'Comment updated successfully',
        };
    });

export const deleteComment = protectedProcedure
    .input(z.object({id: z.number()}))
    .mutation(async ({input, ctx}) => {
        const comment = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_comments')
            .select(['created_by'])
            .where('id', '=', `${input.id}`)
            .where('deleted_at', 'is', null)
            .executeTakeFirst();

        if (!comment) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Comment not found',
            });
        }

        if (
            BigInt(comment.created_by) !== BigInt(ctx.auth!.user_id) &&
            !ctx.auth!.is_user_moderator &&
            !ctx.auth!.is_user_admin
        ) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You can only delete your own comments',
            });
        }

        await ctx.services.postgresQueryBuilder
            .updateTable('jobab_comments')
            .set({deleted_at: new Date()})
            .where('id', '=', `${input.id}`)
            .execute();

        return {
            message: 'Comment deleted successfully',
        };
    });
