import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';

export const approve = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                rejected_at: null,
                rejection_reason: null,
                formalized_at: null,

                approved_at: new Date(),
                moderated_by: ctx.auth.user_id,
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('activity')
                .values({
                    interested_object_owner_user_id: result.created_by,
                    activity_object_owner_user_id: ctx.auth.user_id,
                    event_type: 'approve',
                    interested_object_id: input.petition_id,
                    activity_object_id: result.id,
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
                .insertInto('activity')
                .values({
                    interested_object_owner_user_id: result.created_by,
                    activity_object_owner_user_id: ctx.auth.user_id,
                    event_type: 'reject',
                    interested_object_id: input.petition_id,
                    activity_object_id: result.id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'rejected',
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

                upvote_target: input.upvote_target,
            })
            .where('id', '=', `${input.petition_id}`)
            .returning(['id', 'created_by'])
            .executeTakeFirst();

        if (result) {
            await ctx.services.postgresQueryBuilder
                .insertInto('activity')
                .values({
                    interested_object_owner_user_id: result.created_by,
                    activity_object_owner_user_id: ctx.auth.user_id,
                    event_type: 'formalize',
                    interested_object_id: input.petition_id,
                    activity_object_id: result.id,
                })
                .executeTakeFirst();
        }

        return {
            input,
            message: 'formalized',
        };
    });
