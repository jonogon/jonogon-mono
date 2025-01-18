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
        // Get total count
        const totalCount = await ctx.services.postgresQueryBuilder
            .selectFrom('jobabs')
            .select((eb) => eb.fn.count('id').as('count'))
            .where('deleted_at', 'is', null)
            .where('petition_id', '=', `${input.petition_id}`)
            .executeTakeFirst();

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
            .orderBy('responded_at', 'desc')
            .limit(input.limit)
            .offset(input.offset);

        if (input.respondent_id) {
            query.where('respondent_id', '=', `${input.respondent_id}`);
        }

        if (input.source_type) {
            query.where('source_type', '=', `${input.source_type}`);
        }

        const jobabs = await query.execute();
        const jobabIds = jobabs.map((jobab) => jobab.id);

        // Load all votes for selected jobabs
        const votesQuery = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_votes')
            .select(['jobab_id', (eb) => eb.fn.sum('vote').as('vote_count')])
            .where('jobab_id', 'in', jobabIds)
            .where('nullified_at', 'is', null)
            .groupBy('jobab_id')
            .execute();

        // load user votes if authenticated
        let userVotes: Record<string, number> = {};
        if (ctx.auth?.user_id) {
            const userVotesResult = await ctx.services.postgresQueryBuilder
                .selectFrom('jobab_votes')
                .select(['jobab_id', 'vote'])
                .where('jobab_id', 'in', jobabIds)
                .where('user_id', '=', `${ctx.auth.user_id}`)
                .where('nullified_at', 'is', null)
                .execute();

            userVotes = Object.fromEntries(
                userVotesResult.map((v) => [v.jobab_id, v.vote]),
            );
        }

        // load attachments for selected ids
        const attachments = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_attachments')
            .select(['id', 'jobab_id', 'filename', 'attachment'])
            .where('jobab_id', 'in', jobabIds)
            .where('deleted_at', 'is', null)
            .execute();

        // Group attachments by jobab_id
        const attachmentsByJobabId: Record<
            string,
            Array<{id: number; filename: string; attachment: string}>
        > = {};
        for (const attachment of attachments) {
            if (!attachmentsByJobabId[attachment.jobab_id]) {
                attachmentsByJobabId[attachment.jobab_id] = [];
            }
            attachmentsByJobabId[attachment.jobab_id].push({
                ...attachment,
                id: Number(attachment.id),
            });
        }

        // Transform results
        const jobabsWithDetails = await Promise.all(
            jobabs.map(async (jobab) => {
                const jobabAttachments = attachmentsByJobabId[jobab.id] || [];
                const transformedAttachments = await Promise.all(
                    jobabAttachments.map(async (attachment) => ({
                        ...attachment,
                        url: await ctx.services.fileStorage.getFileURL(
                            attachment.attachment,
                        ),
                    })),
                );

                const votes = votesQuery.find((v) => v.jobab_id === jobab.id);

                return {
                    ...jobab,
                    attachments: transformedAttachments,
                    vote_count: Number(votes?.vote_count || 0),
                    user_vote: userVotes[jobab.id] || null,
                };
            }),
        );

        return {
            data: jobabsWithDetails,
            total: Number(totalCount?.count || 0),
        };
    });

export const getAllJobabs = publicProcedure
    .input(
        z.object({
            limit: z.number().min(1).max(100).default(10),
            offset: z.number().min(0).default(0),
            sort: z.enum(['time', 'votes']).default('votes'),
            order: z.enum(['asc', 'desc']).default('desc'),}),
    )
    .query(async ({ctx, input}) => {
        // Get total count
        const totalCount = await ctx.services.postgresQueryBuilder
            .selectFrom('jobabs')
            .select((eb) => eb.fn.count('id').as('count'))
            .where('deleted_at', 'is', null)
            .executeTakeFirst();

        // vote counts for sorting
        const voteCountsQuery = ctx.services.postgresQueryBuilder
            .selectFrom('jobab_votes')
            .select(['jobab_id', (eb) => eb.fn.count('vote').as('vote_count')])
            .where('vote', '=', 1)
            .where('nullified_at', 'is', null)
            .groupBy('jobab_id');
        

        let baseQuery = ctx.services.postgresQueryBuilder
            .selectFrom('jobabs')
            .innerJoin('respondents', 'jobabs.respondent_id', 'respondents.id')
            .innerJoin('petitions', 'jobabs.petition_id', 'petitions.id')
            .leftJoin(
                voteCountsQuery.as('vote_counts'),
                'vote_counts.jobab_id',
                'jobabs.id',
            )
            .select([
                'jobabs.id',
                'jobabs.title as jobab_title',
                'jobabs.responded_at',
                'jobabs.source_type',
                'respondents.name as respondent_name',
                'petitions.title as petition_title',
                'petitions.id as petition_id',
                'vote_counts.vote_count',
            ])
            .where('jobabs.deleted_at', 'is', null);

        // Apply sorting
        if (input.sort === 'time') {
            baseQuery = baseQuery.orderBy('jobabs.responded_at', input.order);
        } else if (input.sort === 'votes') {
            baseQuery = baseQuery
                .orderBy('vote_counts.vote_count', input.order === 'desc' ? 'asc' : 'desc')
                .orderBy('jobabs.responded_at', 'desc')
        }
        
        const jobabs = await baseQuery
            .limit(input.limit)
            .offset(input.offset)
            .execute();
        
        const jobabIds = jobabs.map((jobab) => jobab.id);

        // Get vote counts for final display
        const votes = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_votes')
            .select(['jobab_id', 'vote'])
            .where('jobab_id', 'in', jobabIds)
            .where('nullified_at', 'is', null)
            .execute();

        // Get comment counts
        const commentCounts = await ctx.services.postgresQueryBuilder
            .selectFrom('jobab_comments')
            .select(['jobab_id', (eb) => eb.fn.count('id').as('comment_count')])
            .where('jobab_id', 'in', jobabIds)
            .where('deleted_at', 'is', null)
            .groupBy('jobab_id')
            .execute();

        // Process votes
        const votesByJobabId = votes.reduce(
            (acc, vote) => {
                if (!acc[vote.jobab_id]) {
                    acc[vote.jobab_id] = {upvotes: 0, downvotes: 0};
                }
                if (vote.vote === 1) {
                    acc[vote.jobab_id].upvotes++;
                } else if (vote.vote === -1) {
                    acc[vote.jobab_id].downvotes++;
                }
                return acc;
            },
            {} as Record<string | number, {upvotes: number; downvotes: number}>,
        );

        const commentCountByJobabId = Object.fromEntries(
            commentCounts.map((c) => [c.jobab_id, Number(c.comment_count)]),
        );

        const jobabSummaries = await Promise.all(
            jobabs.map(async (jobab) => {
                const votes = votesByJobabId[jobab.id] || {
                    upvotes: 0,
                    downvotes: 0,
                };

                return {
                    id: jobab.id,
                    title: jobab.jobab_title,
                    responded_at: jobab.responded_at,
                    upvotes: votes.upvotes,
                    downvotes: votes.downvotes,
                    comment_count: commentCountByJobabId[jobab.id] || 0,
                    respondent_name: jobab.respondent_name,
                    source_type: jobab.source_type,
                    petition_id: jobab.petition_id,
                    petition_title: jobab.petition_title,
                };
            }),
        );

        return {
            input,
            data: jobabSummaries,
            total: Number(totalCount?.count || 0),
        };
    });
