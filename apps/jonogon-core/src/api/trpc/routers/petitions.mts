import {publicProcedure, router} from '../index.mjs';
import {z} from 'zod';
import {protectedProcedure} from '../middleware/protected.mjs';

export const petitionRouter = router({
    // CRUD
    list: protectedProcedure
        .input(
            z.object({
                filter: z.enum(['requested', 'formalized', 'own']),
                sort: z.enum(['submission_time', 'votes']),
                page: z.number().default(0),
            }),
        )
        .query(async ({input, ctx}) => {}),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({input, ctx}) => {}),
    create: protectedProcedure.mutation(async ({input, ctx}) => {}),
    update: protectedProcedure.mutation(async ({input, ctx}) => {}),

    submit: protectedProcedure.mutation(async ({input, ctx}) => {}),

    removeAttachment: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                image_id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    remove: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    // Skibidi
    vote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                vote: z.union([z.literal('up'), z.literal('down')]),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    clearVote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    // Admin
    approve: publicProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    reject: publicProcedure
        .input(
            z.object({
                id: z.number(),
                reason: z.string(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),

    formalize: publicProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(async ({input, ctx}) => {}),
});
