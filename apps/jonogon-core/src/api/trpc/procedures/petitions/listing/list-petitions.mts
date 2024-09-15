import {publicProcedure} from '../../../index.mjs';
import {z} from 'zod';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {pick} from 'es-toolkit';
import {deriveStatus} from '../../../../../db/model-utils/petition.mjs';

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
