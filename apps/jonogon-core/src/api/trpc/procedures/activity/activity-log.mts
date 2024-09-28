import {z} from 'zod';
import {protectedProcedure} from '../../middleware/protected.mjs';

const USER_ACTIVITY_PAGE_SIZE = 30;
export const userActivityLogProcedure = protectedProcedure
    .input(
        z.object({
            page: z.number().default(0),
            activity_type: z.enum([
                'petitions',
                'comments',
                'comment_votes',
                'petition_votes',
            ]).default('petition_votes'),
        })
    )
    .mutation(async ({input, ctx}) => {
        const page = input.page;
        const db = ctx.services.postgresQueryBuilder;
        const userId = `${ctx.auth.user_id}`;  // Replace with actual user ID
        const offset = page * USER_ACTIVITY_PAGE_SIZE;
        const limit = USER_ACTIVITY_PAGE_SIZE + 1;

        if (input.activity_type === 'comments') {
            const commentsMade =
                await db
                    .selectFrom('comments')
                    .innerJoin('petitions', (join) =>
                        join.onRef('comments.petition_id', '=', 'petitions.id'),
                    )
                    .select([
                        'comments.id',
                        'comments.body',
                        'comments.created_at',
                        'comments.petition_id',
                        'petitions.title as petition_title',
                    ])
                    .where('comments.created_by', '=', userId)
                    .where('comments.deleted_at', 'is', null)
                    .where('petitions.deleted_at', 'is', null)
                    .orderBy('comments.created_at', 'desc')
                    .offset(offset)
                    .limit(limit)
                    .execute();

            return {
                data: {
                    activity_type: input.activity_type,
                    page: input.page,
                    hasNextPage: commentsMade.length > USER_ACTIVITY_PAGE_SIZE,
                    comments: commentsMade.slice(0, USER_ACTIVITY_PAGE_SIZE),
                },
            }
        }

        if (input.activity_type === 'comment_votes') {
            const votedComments =
                await db
                    .selectFrom('comment_votes')
                    .innerJoin('comments', (join) =>
                        join.onRef('comment_votes.comment_id', '=', 'comments.id'),
                    )
                    .innerJoin('petitions', (join) =>
                        join.onRef('comments.petition_id', '=', 'petitions.id'),
                    )
                    .select([
                        'comments.id',
                        'comments.body',
                        'comments.created_at',
                        'comments.petition_id',
                        'petitions.title as petition_title',
                        'comment_votes.vote',
                    ])
                    .where('comments.created_by', '=', userId)
                    .where('comments.deleted_at', 'is', null)
                    .where('petitions.deleted_at', 'is', null)
                    .orderBy('comments.created_at', 'desc')
                    .offset(offset)
                    .limit(limit)
                    .execute();

            return {
                data: {
                    activity_type: input.activity_type,
                    page: input.page,
                    hasNextPage: votedComments.length > USER_ACTIVITY_PAGE_SIZE,
                    comment_votes: votedComments.slice(0, USER_ACTIVITY_PAGE_SIZE),
                }
            }
        }

        // Probably not required in activity log
        if (input.activity_type === 'petitions') {
            const approvedPetitions =
                await db
                    .selectFrom('petitions')
                    .select([
                        'petitions.id',
                        'petitions.title',
                        'petitions.approved_at',
                    ])
                    .where('petitions.created_by', '=', userId)
                    .where('petitions.deleted_at', 'is', null)
                    .where('petitions.approved_at', 'is not', null)
                    .orderBy('created_at', 'desc')
                    .offset(offset)
                    .limit(limit)
                    .execute();

            return {
                data: {
                    activity_type: input.activity_type,
                    page: input.page,
                    hasNextPage: approvedPetitions.length > USER_ACTIVITY_PAGE_SIZE,
                    petitions: approvedPetitions.slice(0, USER_ACTIVITY_PAGE_SIZE),
                },
            }
        }

        // default: 'petition_votes'
        const votedPetitions =
            await db
                .selectFrom('petition_votes')
                .innerJoin('petitions', (join) =>
                    join.onRef('petition_votes.petition_id', '=', 'petitions.id'),
                )
                .select([
                    'petition_votes.id',
                    'petitions.id as petition_id',
                    'petitions.title',
                    'petition_votes.vote',
                    'petition_votes.created_at',
                ])
                .where('petition_votes.user_id', '=', userId)
                .where('petitions.deleted_at', 'is', null)
                .where('petitions.approved_at', 'is not', null)
                .orderBy('created_at', 'desc')
                .offset(offset)
                .limit(limit)
                .execute();

        
        return {
            data: {
                activity_type: input.activity_type,
                page: input.page,
                hasNextPage: votedPetitions.length > USER_ACTIVITY_PAGE_SIZE,
                petition_votes: votedPetitions.slice(0, USER_ACTIVITY_PAGE_SIZE),
            },
        };
    });
