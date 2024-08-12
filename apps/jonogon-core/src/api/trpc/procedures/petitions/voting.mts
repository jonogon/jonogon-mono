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
        await ctx.services.postgresQueryBuilder
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
            .executeTakeFirst();

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
        await ctx.services.postgresQueryBuilder
            .deleteFrom('petition_votes')
            .where('petition_id', '=', input.petition_id)
            .where('user_id', '=', `${ctx.auth.user_id}`)
            .executeTakeFirst();

        return {
            input,
            message: 'vote-cleared',
        };
    });
