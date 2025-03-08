import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';
import {calculateNoveltyBoost} from '../../../utility/feed-algorithm.mjs';
import { requireModeratorOrAdmin } from '../../../utility/auth-utils.js';
import {TRPCError} from '@trpc/server';

export const approve = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
            category_id: z.number().optional(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        if (!ctx.auth.is_user_admin && !ctx.auth.is_user_moderator) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to approve petitions.',
            });
        }

        // set initial score when the petition appears on feed
        const { logScore, newScore } = calculateNoveltyBoost();
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select(['approved_at'])
            .where('id', '=', `${input.petition_id}`)
            .executeTakeFirst();
        
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                rejected_at: null,
                rejection_reason: null,
                flagged_at: null,
                flagged_reason: null,
                hold_at: null,
                hold_reason: null,
                formalized_at: null,

                approved_at: petition?.approved_at ? petition.approved_at : new Date(),
                moderated_by: ctx.auth.user_id,
                score: newScore,
                log_score: logScore,
                category_id: input.category_id,
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
        if (!ctx.auth.is_user_admin && !ctx.auth.is_user_moderator) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to reject petitions.',
            });
        }

        // Check if the petition is already approved
        const petition = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select(['approved_at'])
            .where('id', '=', `${input.petition_id}`)
            .executeTakeFirst();

        if (petition?.approved_at) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Petition is already approved, cannot be rejected',
            });
        }

        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                approved_at: null,
                flagged_at: null,
                flagged_reason: null,
                hold_reason: null,
                hold_at: null,
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
            reason: z.string().optional(),
            flagged: z.boolean(), // Flag or unflag, if flagged === true,then unflag the petition and vice versa
        }),
    )
    .mutation(async ({input, ctx}) => {
        if (!ctx.auth.is_user_admin && !ctx.auth.is_user_moderator) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to flag petitions.',
            });
        }

        // Update the petition to set flagged_at and flagged_reason
        const result = await ctx.services.postgresQueryBuilder
            .updateTable('petitions')
            .set({
                rejected_at: null, // Reset the rejected_at timestamp
                rejection_reason: null, // Reset the rejection_reason
                formalized_at: null, // Reset the formalized_at timestamp
                hold_reason: null,
                hold_at: null,

                flagged_at: input.flagged ? null : new Date(), // Set the current timestamp
                flagged_reason: input.flagged ? null : input.reason, // Set the reason for flagging
                moderated_by: ctx.auth.user_id, // Set the user who flagged or unflagged
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

export const hold = protectedProcedure
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
                rejected_at: null,
                rejection_reason: null,
                formalized_at: null,

                hold_at: new Date(),
                hold_reason: input.reason,
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
export const formalize = protectedProcedure
    .input(
        z.object({
            petition_id: z.number(),
            upvote_target: z.number(),
        }),
    )
    .mutation(async ({input, ctx}) => {
      if (!ctx.auth.is_user_admin && !ctx.auth.is_user_moderator) {
          throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'You do not have permission to formalize petitions.',
          });
      }

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

export const adminPetitionList = protectedProcedure
    .input(
        z.object({
            search: z.string().optional(),
            status: z
                .enum(['PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD'])
                .optional(),
            flagged: z.boolean().nullable().optional(),
            limit: z.number().min(1).max(500).default(30),
            offset: z.number().min(0).default(0),
        }),
    )
    .query(async ({ ctx, input }) => {
        requireModeratorOrAdmin(
            ctx,
            undefined,
            'You do not have permission to access data',
        );
        const { search, status, flagged, limit, offset } = input;

        let petitions = ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .innerJoin('users', 'users.id', 'petitions.created_by')
            .leftJoin('categories', 'categories.id', 'petitions.category_id')
            .leftJoin('andolon', 'andolon.id', 'petitions.andolon_id')
            .select([
                'petitions.id',
                'petitions.title',
                'petitions.description',
                'petitions.location',
                'petitions.target',
                'petitions.created_at',
                'petitions.created_by',
                'petitions.submitted_at',
                'petitions.approved_at',
                'petitions.rejected_at',
                'petitions.rejection_reason',
                'petitions.hold_at',
                'petitions.hold_reason',
                'petitions.flagged_at',
                'petitions.flagged_reason',
                'users.name as user_name',
                'categories.id as category_id',
                'categories.name as category_name',
                'andolon.id as andolon_id',
                'andolon.name as andolon_name'
            ])
            .where('petitions.deleted_at', 'is', null)
            .where('petitions.submitted_at', 'is not', null)
        
        if (search) {
            petitions = petitions.where('petitions.title', 'ilike', `%${search}%`);
        }

        if (status === 'PENDING') {
            petitions = petitions
                .where('petitions.approved_at', 'is', null)
                .where('petitions.rejected_at', 'is', null)
                .where('petitions.hold_at', 'is', null)
                .where('petitions.submitted_at', 'is not', null);
        } else if (status === 'APPROVED') {
            petitions = petitions
                .where('petitions.approved_at', 'is not', null)
                .where('petitions.flagged_at', 'is', null);
        } else if (status === 'REJECTED') {
            petitions = petitions.where('petitions.rejected_at', 'is not', null);
        } else if (status === 'ON_HOLD') {
            petitions = petitions.where('petitions.hold_at', 'is not', null);
        }

        if (typeof flagged === 'boolean') {
            petitions = petitions.where(
                'petitions.flagged_at',
                flagged ? 'is not' : 'is',
                null,
            );
        }

        // Add this count query before executing your main query
        const countResults = await petitions
            .clearLimit()
            .clearOffset()
            .execute();

        const results = await petitions
            .orderBy('petitions.created_at', 'desc')
            .limit(limit)
            .offset(offset)
            .execute();
        
        return {
            data: results.map((petition) => ({
                id: petition.id,
                title: petition.title,
                description: petition.description,
                location: petition.location,
                target: petition.target,
                created_at: petition.created_at,
                created_by: petition.created_by,
                submitted_at: petition.submitted_at,
                approved_at: petition.approved_at,
                rejected_at: petition.rejected_at,
                rejection_reason: petition.rejection_reason,
                hold_at: petition.hold_at,
                hold_reason: petition.hold_reason,
                flagged_at: petition.flagged_at,
                flagged_reason: petition.flagged_reason,
                user_name: petition.user_name,
                category: petition.category_id ? { id: Number(petition.category_id), name: petition.category_name } : null,
                andolon: petition.andolon_id ? { id: Number(petition.andolon_id), name: petition.andolon_name } : null
            })),
            pagination: {
                total: Number(countResults.length || 0) || 0,
                offset,
                limit,
            },
        };
    });

export const adminCategoryList = protectedProcedure
    .query(async ({ ctx }) => {
        requireModeratorOrAdmin(
            ctx,
            undefined,
            'You do not have permission to access data',
        );

        const categories = await ctx.services.postgresQueryBuilder
            .selectFrom('categories')
            .select(['id', 'name', 'created_at'])
            .where('deleted_at', 'is', null)
            .orderBy('name')
            .execute();
        return categories;
    });
export const createCategory = protectedProcedure
    .input(
        z.object({
            name: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        requireModeratorOrAdmin(
            ctx,
            undefined,
            'You do not have permission to create categories'
        );

        const result = await ctx.services.postgresQueryBuilder
            .insertInto('categories')
            .values({
                name: input.name,
            })
            .returning(['id', 'name', 'created_at'])
            .executeTakeFirst();

        return result;
    });

export const createAndolon = protectedProcedure
    .input(
        z.object({
            name: z.string(),
        }),
    )
    .mutation(async ({input, ctx}) => {
        requireModeratorOrAdmin(
            ctx,
            undefined,
            'You do not have permission to create andolon'
        );

        const result = await ctx.services.postgresQueryBuilder
            .insertInto('andolon')
            .values({
                name: input.name,
            })
            .returning(['id', 'name', 'created_at'])
            .executeTakeFirst();

        return result;
    })

export const getAdminAndolonList = protectedProcedure
    .query(async ({ctx}) => {
        const andolons = await ctx.services.postgresQueryBuilder
            .selectFrom('andolon')
            .select(['id', 'name', 'created_at'])
            .where('deleted_at', 'is', null)
            .orderBy('created_at', 'desc')
            .execute();
        return andolons;
    });

export const getAndolonPetitions = protectedProcedure
    .input(
        z.object({
            andolon_id: z.number(),
        }),
    )
    .query(async ({input, ctx}) => {
        const petitions = await ctx.services.postgresQueryBuilder
            .selectFrom('petitions')
            .select([
                'id',
                'title',
            ])
            .where('andolon_id', '=', String(input.andolon_id))
            .where('deleted_at', 'is', null)
            .orderBy('created_at', 'desc')
            .execute()

        return {
            data: petitions,
        };
    });

export const linkPetition = protectedProcedure
.input(
    z.object({
        petition_id: z.number(),
        andolon_id: z.number(),
        link: z.boolean(),
    }),
)
.mutation(async ({input, ctx}) => {
    requireModeratorOrAdmin(
        ctx,
        undefined,
        'You do not have permission to link/unlink petition'
    );

    const result = await ctx.services.postgresQueryBuilder
        .updateTable('petitions')
        .set({
            andolon_id: input.link ? input.andolon_id : null,
        })
        .where('id', '=', `${input.petition_id}`)
        .returning(['id', 'title'])
        .executeTakeFirst();

    return result;
});
