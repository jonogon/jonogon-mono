import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';
import { calculateNoveltyBoost } from '../../../utility/feed-algorithm.mjs';

export const approve = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // set initial score when the petition appears on feed
        const boostingScore = calculateNoveltyBoost(new Date())
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                rejected_at: null,
                rejection_reason: null,
                flagged_at: null,
                flagged_reason: null,
                formalized_at: null,

                approved_at: new Date(),
                moderated_by: ctx.auth.user_id,
                score: boostingScore,
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: result.created_by,
                    type: 'petition_approved',
                    actor_user_id: ctx.auth.user_id,
                    petition_id: input.petition_id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'approved',
        };
    });

export const reject = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
            reason: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                approved_at: null,
                flagged_at: null,
                flagged_reason: null,
                formalized_at: null,

                rejected_at: new Date(),
                rejection_reason: input.reason,
                moderated_by: ctx.auth.user_id,
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: result.created_by,
                    type: 'petition_rejected',
                    actor_user_id: ctx.auth.user_id,
                    petition_id: input.petition_id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'rejected',
        };
    });

export const flag = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
            reason: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // Update the petition to set flagged_at and flagged_reason
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                rejected_at: null, // Reset the rejected_at timestamp
                rejection_reason: null, // Reset the rejection_reason
                formalized_at: null, // Reset the formalized_at timestamp

                flagged_at: new Date(), // Set the current timestamp
                flagged_reason: input.reason, // Set the reason for flagging
                moderated_by: ctx.auth.user_id, // Set the user who flagged
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        // If the petition was successfully updated, create a notification
        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: result.created_by, // Notify the creator of the petition
                    type: 'petition_flagged', // Type of notification
                    actor_user_id: ctx.auth.user_id, // The user who flagged the petition
                    petition_id: input.petition_id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'flagged',
        };
    });

export const unflag = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        // Update the petition to remove the flag
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                flagged_at: null, // Remove the flagged timestamp
                flagged_reason: null, // Remove the flagged reason
                moderated_by: ctx.auth.user_id, // Set the user who unflagged
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        // If the petition was successfully updated, create a notification
        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: result.created_by, // Notify the creator of the petition
                    type: 'petition_unflagged', // Type of notification
                    actor_user_id: ctx.auth.user_id, // The user who unflagged the petition
                    petition_id: input.petition_id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'unflagged',
        };
    });

export const formalize = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
            upvote_target: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                formalized_at: new Date(),
                formalized_by: ctx.auth.user_id,

                rejected_at: null,
                rejection_reason: null,
                flagged_at: null,
                flagged_reason: null,

                upvote_target: input.upvote_target,
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('notifications')
                .values({
                    user_id: result.created_by,
                    type: 'petition_formalized',
                    actor_user_id: ctx.auth.user_id,
                    petition_id: input.petition_id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'formalized',
        };
    });
