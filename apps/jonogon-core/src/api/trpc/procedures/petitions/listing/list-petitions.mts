import {publicProcedure} from '../../../index.mjs';
import {z} from 'zod';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {orderBy, pick} from 'es-toolkit';
import {deriveStatus} from '../../../../../db/model-utils/petition.mjs';
import {sql} from 'kysely';
import {jsonArrayFrom} from 'kysely/helpers/postgres';
import {protectedProcedure} from '../../../middleware/protected.mjs';

export const listPetitions = publicProcedure
    .input(
        z.object({
            filter: z.enum(['request', 'formalized', 'own']).default('request'),
            sort: z.enum(['time', 'votes']).default('votes'),
            order: z.enum(['asc', 'desc']).default('desc'),
            page: z.number().default(0),
        }),
    )
    .query(async ({input, ctx}) => {
        const query = ctx.services.postgresQueryBuilder
            .with('results', (db) => {
                return scope(
                    scope(
                        scope(
                            db
                                .selectFrom('petitions')
                                .where('deleted_at', 'is', null)
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
                                ]),
                        ).let((query) => {
                            if (input.filter === 'request') {
                                return query
                                    .where(
                                        'petitions.approved_at',
                                        'is not',
                                        null,
                                    )
                                    .where(
                                        'petitions.formalized_at',
                                        'is',
                                        null,
                                    );
                            } else if (input.filter === 'formalized') {
                                return query.where(
                                    'petitions.formalized_at',
                                    'is not',
                                    null,
                                );
                            } else {
                                return query;
                            }
                        }),
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
                        input.sort === 'time'
                            ? query.orderBy(
                                  input.filter === 'own'
                                      ? 'petitions.created_at'
                                      : input.filter === 'request'
                                        ? 'petitions.submitted_at'
                                        : 'petitions.formalized_at',
                                  input.order,
                              )
                            : query.orderBy(
                                  'petition_upvote_count',
                                  input.order,
                              ),
                    )
                    .groupBy(['petitions.id'])
                    .offset(input.page * 32)
                    .limit(33);
            })
            .with('result_with_downvotes', (db) => {
                return db
                    .selectFrom('results')
                    .leftJoin('petition_votes as downvotes', (join) =>
                        join
                            .onRef('results.id', '=', 'downvotes.petition_id')
                            .on('downvotes.vote', '=', -1),
                    )
                    .selectAll('results')
                    .select(({fn}) => [
                        fn.count('downvotes.id').as('petition_downvote_count'),
                    ])
                    .groupBy(['results.id', 'results.petition_upvote_count']);
            })
            .with('result_with_comment_count', (db) => {
                return db
                    .selectFrom('results')
                    .leftJoin('comments', 'results.id', 'comments.petition_id')
                    .selectAll('results')
                    .where('comments.deleted_at', 'is', null)
                    .select(({fn}) => [
                        fn.count('comments.id').as('petition_comment_count'),
                    ])
                    .groupBy(['results.id', 'results.petition_upvote_count']);
            })
            .with('first_attachments', (db) => {
                return db
                    .selectFrom('results')
                    .innerJoin('petition_attachments', (join) => {
                        return join
                            .onRef(
                                'results.id',
                                '=',
                                'petition_attachments.petition_id',
                            )
                            .on('petition_attachments.deleted_at', 'is', null)
                            .on('petition_attachments.is_image', '=', true);
                    })
                    .select([
                        'petition_attachments.petition_id',
                        'petition_attachments.attachment',
                    ])
                    .distinctOn('petition_attachments.petition_id')
                    .orderBy('petition_attachments.petition_id', 'asc')
                    .orderBy('petition_attachments.created_at', 'asc');
            })
            .selectFrom('result_with_downvotes')
            .innerJoin('petitions', 'petitions.id', 'result_with_downvotes.id')
            .innerJoin(
                'result_with_comment_count',
                'petitions.id',
                'result_with_comment_count.id',
            )
            .innerJoin('users', 'users.id', 'petitions.created_by')
            .leftJoin('petition_votes as votes', (join) =>
                join
                    .onRef('petitions.id', '=', 'votes.petition_id')
                    .on('votes.user_id', '=', `${ctx.auth?.user_id ?? 0}`),
            )
            .leftJoin(
                'first_attachments',
                'first_attachments.petition_id',
                'petitions.id',
            )
            .selectAll('petitions')
            .select([
                'users.name as user_name',
                'users.picture as user_picture',
                'result_with_downvotes.petition_upvote_count',
                'result_with_downvotes.petition_downvote_count',
                'result_with_comment_count.petition_comment_count',
                'votes.vote as user_vote',
                'first_attachments.attachment as attachment',
            ]);

        const data =
            input.sort === 'time'
                ? await query
                      .orderBy(
                          input.filter === 'own'
                              ? 'petitions.created_at'
                              : input.filter === 'request'
                                ? 'petitions.submitted_at'
                                : 'petitions.formalized_at',
                          input.order,
                      )
                      .execute()
                : await query
                      .orderBy('petition_upvote_count', input.order)
                      .execute();

        return {
            input,
            data: await Promise.all(
                // Use await here
                data.map(async (petition) => ({
                    data: {
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
                            'petition_comment_count',
                            'upvote_target',
                        ]),
                        created_by: {
                            id: petition.created_by,
                            name: petition.user_name,
                            picture: petition.user_picture,
                        },
                        status: deriveStatus(petition),
                        attachment: petition.attachment
                            ? await ctx.services.fileStorage.getFileURL(
                                  // Await the promise here
                                  petition.attachment,
                              )
                            : null,
                    },
                    extras: {
                        user_vote: petition.user_vote,
                        user: {
                            name: petition.user_name,
                            picture: petition.user_picture,
                        },
                    },
                })),
            ),
        };
    });

export const listSuggestedPetitions = protectedProcedure
    .input(
        z.object({
            location: z.string(),
            target: z.string(),
            petitionId: z.string(),
        }),
    )
    .query(async ({input, ctx}) => {
        const TIME_PERIOD = '30 days';

        /**  Suggested feed based on trending petitions **/
        try {
            const baseQuery = ctx.services.postgresQueryBuilder
                .selectFrom('petitions')
                .where('petitions.deleted_at', 'is', null)
                .where('petitions.approved_at', 'is not', null)
                .where('petitions.id', '!=', input.petitionId) // Exclude the current petition
                .leftJoin('petition_votes as votes', (join) =>
                    join
                        .onRef('petitions.id', '=', 'votes.petition_id')
                        .on('votes.user_id', '=', `${ctx.auth?.user_id ?? 0}`),
                )
                .where('votes.petition_id', 'is', null) // Exclude petitions that have been voted by the user
                .leftJoin(
                    'petition_votes',
                    'petitions.id',
                    'petition_votes.petition_id',
                )
                .select((eb) => [
                    'petitions.id',
                    'petitions.title',
                    'petitions.location',
                    'petitions.target',
                    'petitions.created_at',
                    eb.fn.count('petition_votes.id').as('vote_count'),
                    sql<number>`SUM(CASE WHEN "petition_votes"."vote" = 1 THEN 1 ELSE 0 END)`.as(
                        'upvotes',
                    ),
                    sql<number>`SUM(CASE WHEN "petition_votes"."vote" = -1 THEN 1 ELSE 0 END)`.as(
                        'downvotes',
                    ),
                    jsonArrayFrom(
                        eb
                            .selectFrom('petition_attachments')
                            .selectAll()
                            .whereRef(
                                'petition_attachments.petition_id',
                                '=',
                                'petitions.id',
                            )
                            .where(
                                'petition_attachments.deleted_at',
                                'is',
                                null,
                            )
                            .where('petition_attachments.is_image', '=', true),
                    ).as('attachments'),
                ])
                .groupBy(['petitions.id'])
                .orderBy('vote_count desc')
                .orderBy('created_at', 'desc')
                .limit(5);

            // Petitions for similar locations and targets
            const similarPetitions = await baseQuery
                .where((eb) =>
                    eb.or([
                        eb('location', '=', input.location),
                        eb('target', '=', input.target),
                    ]),
                )
                .execute();

            // Petitions for last 30 days
            const recentPetitions = await baseQuery
                .where(
                    'petitions.created_at',
                    '>=',
                    sql<Date>`NOW() - INTERVAL ${sql.lit(TIME_PERIOD)}`,
                )
                .execute();

            const combinedPetitions = [...recentPetitions, ...similarPetitions];
            const uniquePetitions = new Map<
                string,
                (typeof combinedPetitions)[number]
            >();

            combinedPetitions.forEach((petition) => {
                if (!uniquePetitions.has(petition.id)) {
                    uniquePetitions.set(petition.id, petition);
                }
            });

            const suggestedPetitions = Array.from(uniquePetitions.values());

            return {
                data: await Promise.all(
                    suggestedPetitions.map(async (petition) => ({
                        ...petition,
                        attachments:
                            petition.attachments.length > 0
                                ? await ctx.services.fileStorage.getFileURL(
                                      petition.attachments[0].attachment,
                                  )
                                : null,
                    })),
                ),
            };
        } catch (error) {
            console.error('Error fetching suggested petitions:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An error occurred while fetching suggested petitions',
            });
        }
    });
