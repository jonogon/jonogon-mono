import {publicProcedure} from '../../../index.mjs';
import {z} from 'zod';
import {scope} from 'scope-utilities';
import {TRPCError} from '@trpc/server';
import {pick} from 'es-toolkit';
import {deriveStatus} from '../../../../../db/model-utils/petition.mjs';

export const listFormalizedPetitions = publicProcedure
    .input(
        z.object({
            sort: z.enum(['formalization_time', 'upvotes']).default('upvotes'),
            order: z.enum(['asc', 'desc']).default('desc'),
            page: z.number().default(0),
        }),
    )
    .query(async ({input, ctx}) => {
        const query = ctx.services.postgresQueryBuilder
            .with('results', (db) => {
                return scope(
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
                            fn.count('upvotes.id').as('petition_upvote_count'),
                        ])
                        .where('petitions.formalized_at', 'is not', null),
                )
                    .let((query) =>
                        input.sort === 'formalization_time'
                            ? query.orderBy(
                                  'petitions.formalized_at',
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
            .selectFrom('results')
            .innerJoin('petitions', 'petitions.id', 'results.id')
            .innerJoin('users', 'users.id', 'petitions.created_by')
            .leftJoin('petition_votes as votes', (join) =>
                join
                    .onRef('petitions.id', '=', 'votes.petition_id')
                    .on('votes.user_id', '=', `${ctx.auth?.user_id ?? 0}`),
            )
            .selectAll('petitions')
            .select([
                'users.name as user_name',
                'users.picture as user_picture',
                'results.petition_upvote_count',
                'votes.vote as user_vote',
            ]);

        const data = await query.execute();

        return {
            input,
            data: data.map((petition) => ({
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
                    ]),
                    created_by: {
                        id: petition.created_by,
                        name: petition.user_name,
                        picture: petition.user_picture,
                    },
                    status: deriveStatus(petition),
                },
                extras: {
                    user_vote: petition.user_vote,
                },
            })),
        };
    });
