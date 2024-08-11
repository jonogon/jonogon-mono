import {publicProcedure, router} from '../index.mjs';
import {z} from 'zod';
import {protectedProcedure} from '../middleware/protected.mjs';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {pick} from 'es-toolkit';
import {Petitions} from '../../../db/postgres/types.mjs';
import {SelectType} from 'kysely';

function deriveStatus(petition: {
    approved_at: SelectType<Petitions['approved_at']>;
    formalized_at: SelectType<Petitions['formalized_at']>;
    rejected_at: SelectType<Petitions['rejected_at']>;
    submitted_at: SelectType<Petitions['submitted_at']>;
}) {
    if (petition.formalized_at) {
        return 'formalized';
    }

    if (petition.approved_at) {
        return 'approved';
    }

    if (petition.rejected_at) {
        return 'rejected';
    }

    if (petition.submitted_at) {
        return 'submitted';
    }

    return 'draft';
}

export const petitionRouter = router({
    // CRUD
    listPetitionRequests: publicProcedure
        .input(
            z.object({
                filter: z.enum(['all', 'own']).default('all'),
                sort: z.enum(['submission_time', 'upvotes']).default('upvotes'),
                order: z.enum(['asc', 'desc']).default('desc'),
                page: z.number().default(0),
            }),
        )
        .query(async ({input, ctx}) => {
            const query = ctx.services.postgresQueryBuilder
                .with('results', (db) => {
                    return scope(
                        scope(
                            db
                                .selectFrom('petitions')
                                .leftJoin('petition_votes as upvotes', (join) =>
                                    join
                                        .onRef(
                                            'petitions.id',
                                            '=',
                                            'upvotes.petition_id',
                                        )
                                        .on('upvotes.vote', '=', 1),
                                )
                                .select(['petitions.id'])
                                .select(({fn}) => [
                                    fn
                                        .count('upvotes.id')
                                        .as('petition_upvote_count'),
                                ])
                                .where('petitions.submitted_at', 'is not', null)
                                .where('petitions.rejected_at', 'is', null)
                                .where('petitions.formalized_at', 'is', null),
                        ).let((query) => {
                            if (input.filter === 'own') {
                                if (!ctx.auth?.user_id) {
                                    throw new TRPCError({
                                        code: 'UNAUTHORIZED',
                                        message:
                                            'must-be-logged-in-to-view-own-petitions',
                                    });
                                }

                                return query.where(
                                    'petitions.created_by',
                                    '=',
                                    `${ctx.auth.user_id}`,
                                );
                            }

                            return query;
                        }),
                    )
                        .let((query) =>
                            input.sort === 'submission_time'
                                ? query.orderBy(
                                      'petitions.submitted_at',
                                      input.order,
                                  )
                                : query.orderBy(
                                      'petition_upvote_count',
                                      input.order,
                                  ),
                        )
                        .groupBy(['petitions.id'])
                        .offset(input.page * 32)
                        .limit(32);
                })
                .with('result_with_downvotes', (db) => {
                    return db
                        .selectFrom('results')
                        .leftJoin('petition_votes as downvotes', (join) =>
                            join
                                .onRef('results.id', '=', 'downvotes.id')
                                .on('downvotes.vote', '=', -1),
                        )
                        .selectAll('results')
                        .select(({fn}) => [
                            fn
                                .count('downvotes.id')
                                .as('petition_downvote_count'),
                        ])
                        .groupBy([
                            'results.id',
                            'results.petition_upvote_count',
                        ]);
                })
                .selectFrom('result_with_downvotes')
                .innerJoin(
                    'petitions',
                    'petitions.id',
                    'result_with_downvotes.id',
                )
                .innerJoin('users', 'users.id', 'petitions.created_by')
                .selectAll('petitions')
                .select([
                    'users.name as user_name',
                    'users.picture as user_picture',
                    'result_with_downvotes.petition_upvote_count',
                    'result_with_downvotes.petition_downvote_count',
                ]);

            const data = await query.execute();

            return {
                input,
                data: data.map((petition) => ({
                    ...pick(petition, [
                        'id',
                        'title',
                        'location',
                        'target',
                        'created_at',
                        'submitted_at',
                        'rejected_at',
                        'rejection_reason',
                        'approved_at',
                        'formalized_at',
                        'petition_upvote_count',
                        'petition_downvote_count',
                    ]),
                    created_by: {
                        id: petition.created_by,
                        name: petition.user_name,
                        picture: petition.user_picture,
                    },
                    status: deriveStatus(petition),
                })),
            };
        }),
    get: publicProcedure
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
        }),
    create: protectedProcedure.mutation(async ({input, ctx}) => {}),
    update: protectedProcedure.mutation(async ({input, ctx}) => {}),

    submit: protectedProcedure.mutation(async ({input, ctx}) => {}),

    removeAttachment: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                image_id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    remove: protectedProcedure
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

            return {input, data: deleted};
        }),

    // Skibidi
    vote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                vote: z.union([z.literal('up'), z.literal('down')]),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    clearVote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    // Admin
    approve: publicProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    reject: publicProcedure
        .input(
            z.object({
                id: z.number(),
                reason: z.string(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    formalize: publicProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),
});
