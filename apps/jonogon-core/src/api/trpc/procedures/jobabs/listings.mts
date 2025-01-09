import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';

export const listJobabs = publicProcedure
    .input(
        z.object({
            petition_id: z.number(),
            respondent_id: z.number().optional(),
            source_type: z
                .enum([
                    'jonogon_direct',
                    'news_article',
                    'official_document',
                    'social_media',
                    'press_release',
                ])
                .optional(),
            limit: z.number().min(1).max(100).default(10),
            offset: z.number().min(0).default(0),
        }),
    )
    .query(async ({ctx, input}) => {
        const query = ctx.services.postgresQueryBuilder
            .selectFrom('jobabs')
            .select([
                'id',
                'petition_id',
                'respondent_id',
                'title',
                'description',
                'source_type',
                'source_url',
                'responded_at',
                'created_by',
                'created_at',
            ])
            .where('deleted_at', 'is', null)
            .where('petition_id', '=', `${input.petition_id}`)
            .limit(input.limit)
            .offset(input.offset);

        if (input.respondent_id) {
            query.where('respondent_id', '=', `${input.respondent_id}`);
        }

        if (input.source_type) {
            query.where('source_type', '=', `${input.source_type}`);
        }

        const jobabs = await query.execute();

        // Get jobabs with votes and attachments
        const jobabsWithDetails = await Promise.all(
            jobabs.map(async (jobab) => {
                const votes = await ctx.services.postgresQueryBuilder
                    .selectFrom('jobab_votes')
                    .select([
                        ctx.services.postgresQueryBuilder.fn
                            .sum('vote')
                            .as('vote_count'),
                    ])
                    .where('jobab_id', '=', `${jobab.id}`)
                    .where('nullified_at', 'is', null)
                    .executeTakeFirst();

                // Get user's vote if authenticated
                let userVote = null;
                if (ctx.auth?.user_id) {
                    const userVoteResult =
                        await ctx.services.postgresQueryBuilder
                            .selectFrom('jobab_votes')
                            .select(['vote'])
                            .where('jobab_id', '=', `${jobab.id}`)
                            .where('user_id', '=', `${ctx.auth.user_id}`)
                            .where('nullified_at', 'is', null)
                            .executeTakeFirst();

                    if (userVoteResult) {
                        userVote = userVoteResult.vote;
                    }
                }

                // Get attachments for each jobab
                const attachments = await ctx.services.postgresQueryBuilder
                    .selectFrom('jobab_attachments')
                    .select(['id', 'filename', 'attachment'])
                    .where('jobab_id', '=', `${jobab.id}`)
                    .where('deleted_at', 'is', null)
                    .execute();

                // Transform attachments to include URLs
                const transformedAttachments = await Promise.all(
                    attachments.map(async (attachment) => ({
                        ...attachment,
                        url: await ctx.services.fileStorage.getFileURL(
                            attachment.attachment,
                        ),
                    })),
                );

                return {
                    ...jobab,
                    attachments: transformedAttachments,
                    vote_count: Number(votes?.vote_count || 0),
                    user_vote: userVote,
                };
            }),
        );

        return {
            data: jobabsWithDetails,
        };
    });
