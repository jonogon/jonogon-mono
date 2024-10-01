import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';

export const vote = protectedProcedure
    .input(
        z.object({
            petition_id: z.string(),
            vote: z.union([z.literal('up'), z.literal('down')]),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .insertInto('petition_votes')
            .values({
                petition_id: input.petition_id,
                user_id: ctx.auth.user_id,
                vote: input.vote === 'up' ? 1 : -1,
            })
            .onConflict((conflict) =>
                conflict
                    .constraint('petition_votes__by_user_on_petition')
                    .doUpdateSet({
                        vote: input.vote === 'up' ? 1 : -1,
                        updated_at: new Date(),
                    }),
            )
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            const petition = await ctx.services.postgresQueryBuilder
                .selectFrom('petitions')
                .where('id', '=', input.petition_id)
                .select(['created_by'])
                .executeTakeFirst();

            if (petition) {
                await ctx.services.postgresQueryBuilder
                    .transaction()
                    .execute(async (t) => {
                        await t
                            .deleteFrom('activity')
                            .where('event_type', '=', 'vote')
                            .where('activity_object_id', '=', result.id)
                            .execute();

                        await t
                            .insertInto('activity')
                            .values({
                                interested_object_owner_user_id:
                                    petition.created_by,
                                activity_object_owner_user_id: ctx.auth.user_id,
                                event_type: 'vote',
                                interested_object_id: input.petition_id,
                                activity_object_id: result.id,
                                meta: JSON.stringify({
                                    vote: input.vote === 'up' ? 1 : -1,
                                }),
                            })
                            .executeTakeFirst();
                    });
            }
        }

        return {
            input,
            message: 'voted',
        };
    });

export const clearVote = protectedProcedure
    .input(
        z.object({
            petition_id: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .deleteFrom('petition_votes')
            .where('petition_id', '=', input.petition_id)
            .where('user_id', '=', `${ctx.auth.user_id}`)
            .returning(['id'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .deleteFrom('activity')
                .where('event_type', '=', 'vote')
                .where('activity_object_id', '=', result.id)
                .execute();
        }

        return {
            input,
            message: 'vote-cleared',
        };
    });
