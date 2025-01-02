import {router} from '../index.mjs';
import {protectedProcedure} from '../middleware/protected.mjs';
import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {publicProcedure} from '../index.mjs';
import {
    requireAdmin,
    requireModeratorOrAdmin,
} from '../../utility/auth-utils.js';

export const respondentRouter = router({
    list: publicProcedure
        .input(
            z.object({
                type: z.enum(['organization', 'expert']).optional(),
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
            }),
        )
        .query(async ({ctx, input}) => {
            const query = ctx.services.postgresQueryBuilder
                .selectFrom('respondents')
                .select([
                    'id',
                    'type',
                    'name',
                    'img',
                    'bio',
                    'website',
                    'created_at',
                ])
                .where('deleted_at', 'is', null)
                .limit(input.limit)
                .offset(input.offset);

            if (input.type) {
                query.where('type', '=', input.type);
            }

            const respondents = await query.execute();

            return {
                data: await Promise.all(
                    respondents.map(async (respondent) => ({
                        ...respondent,
                        img_url: respondent.img
                            ? await ctx.services.fileStorage.getFileURL(
                                  respondent.img,
                              )
                            : null,
                    })),
                ),
            };
        }),

    get: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            const respondent = await ctx.services.postgresQueryBuilder
                .selectFrom('respondents')
                .select([
                    'id',
                    'type',
                    'name',
                    'img',
                    'bio',
                    'website',
                    'created_at',
                ])
                .where('id', '=', input.id)
                .where('deleted_at', 'is', null)
                .executeTakeFirst();

            if (!respondent) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Respondent not found',
                });
            }

            const socialAccounts = await ctx.services.postgresQueryBuilder
                .selectFrom('social_accounts')
                .select(['id', 'platform', 'username', 'url'])
                .where('respondent_id', '=', input.id)
                .execute();

            return {
                data: {
                    ...respondent,
                    img_url: respondent.img
                        ? await ctx.services.fileStorage.getFileURL(
                              respondent.img,
                          )
                        : null,
                    social_accounts: socialAccounts,
                },
            };
        }),

    create: protectedProcedure
        .input(
            z.object({
                type: z.enum(['organization', 'expert']),
                name: z.string().min(1),
                img: z.string().optional(),
                bio: z.string().optional(),
                website: z.string().url().optional(),
                social_accounts: z
                    .array(
                        z.object({
                            platform: z.string(),
                            username: z.string(),
                            url: z.string().url(),
                        }),
                    )
                    .optional(),
            }),
        )
        .mutation(async ({ctx, input}) => {
            requireModeratorOrAdmin(
                ctx,
                undefined,
                'You are not authorized to create respondents',
            );

            const respondent = await ctx.services.postgresQueryBuilder
                .insertInto('respondents')
                .values({
                    type: input.type,
                    name: input.name,
                    img: input.img,
                    bio: input.bio,
                    website: input.website,
                    created_by: BigInt(ctx.auth.user_id),
                })
                .returning(['id'])
                .executeTakeFirst();

            if (input.social_accounts?.length) {
                await ctx.services.postgresQueryBuilder
                    .insertInto('social_accounts')
                    .values(
                        input.social_accounts.map((account) => ({
                            respondent_id: respondent!.id,
                            ...account,
                        })),
                    )
                    .execute();
            }

            return {
                data: {
                    id: respondent!.id,
                },
                message: 'Respondent created successfully',
            };
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                type: z.enum(['organization', 'expert']).optional(),
                name: z.string().min(1).optional(),
                img: z.string().optional(),
                bio: z.string().optional(),
                website: z.string().url().optional(),
                social_accounts: z
                    .array(
                        z.object({
                            id: z.string().optional(),
                            platform: z.string(),
                            username: z.string(),
                            url: z.string().url(),
                        }),
                    )
                    .optional(),
            }),
        )
        .mutation(async ({ctx, input}) => {
            requireModeratorOrAdmin(
                ctx,
                undefined,
                'You are not authorized to update respondents',
            );

            const {id, social_accounts, ...updateData} = input;

            await ctx.services.postgresQueryBuilder
                .updateTable('respondents')
                .set(updateData)
                .where('id', '=', id)
                .execute();

            if (social_accounts) {
                // Delete existing social accounts
                await ctx.services.postgresQueryBuilder
                    .deleteFrom('social_accounts')
                    .where('respondent_id', '=', id)
                    .execute();

                // Insert new social accounts
                await ctx.services.postgresQueryBuilder
                    .insertInto('social_accounts')
                    .values(
                        social_accounts.map((account) => ({
                            respondent_id: BigInt(id),
                            platform: account.platform,
                            username: account.username,
                            url: account.url,
                        })),
                    )
                    .execute();
            }

            return {
                message: 'Respondent updated successfully',
            };
        }),

    delete: protectedProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ctx, input}) => {
            requireAdmin(
                ctx,
                undefined,
                'You are not authorized to delete respondents',
            );

            await ctx.services.postgresQueryBuilder
                .updateTable('respondents')
                .set({
                    deleted_at: new Date(),
                })
                .where('id', '=', input.id)
                .execute();

            return {
                message: 'Respondent deleted successfully',
            };
        }),

    addSocialAccount: protectedProcedure
        .input(
            z.object({
                respondent_id: z.string(),
                platform: z.string(),
                username: z.string(),
                url: z.string().url(),
            }),
        )
        .mutation(async ({ctx, input}) => {
            if (!ctx.auth!.is_user_admin && !ctx.auth!.is_user_moderator) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to add social accounts',
                });
            }

            const socialAccount = await ctx.services.postgresQueryBuilder
                .insertInto('social_accounts')
                .values({
                    respondent_id: BigInt(input.respondent_id),
                    platform: input.platform,
                    username: input.username,
                    url: input.url,
                })
                .returning(['id'])
                .executeTakeFirst();

            return {
                data: {
                    id: socialAccount!.id,
                },
                message: 'Social account added successfully',
            };
        }),

    removeSocialAccount: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ctx, input}) => {
            if (!ctx.auth!.is_user_admin && !ctx.auth!.is_user_moderator) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to remove social accounts',
                });
            }

            await ctx.services.postgresQueryBuilder
                .deleteFrom('social_accounts')
                .where('id', '=', input.id)
                .execute();

            return {
                message: 'Social account removed successfully',
            };
        }),

    updateSocialAccount: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                platform: z.string().optional(),
                username: z.string().optional(),
                url: z.string().url().optional(),
            }),
        )
        .mutation(async ({ctx, input}) => {
            if (!ctx.auth!.is_user_admin && !ctx.auth!.is_user_moderator) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to update social accounts',
                });
            }

            const {id, ...updateData} = input;

            await ctx.services.postgresQueryBuilder
                .updateTable('social_accounts')
                .set(updateData)
                .where('id', '=', id)
                .execute();

            return {
                message: 'Social account updated successfully',
            };
        }),
});
