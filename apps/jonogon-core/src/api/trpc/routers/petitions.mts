import {publicProcedure, router} from '../index.mjs';
import {z} from 'zod';
import {protectedProcedure} from '../middleware/protected.mjs';

export const petitionRouter = router({
    // CRUD
    list: protectedProcedure.query(() => {}),
    get: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(() => {}),
    create: protectedProcedure.mutation(() => {}),
    update: protectedProcedure.mutation(() => {}),

    submit: protectedProcedure.mutation(() => {}),

    removeImage: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                image_id: z.number(),
            }),
        )
        .mutation(() => {}),

    remove: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    // Skibidi
    vote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                vote: z.union([z.literal('up'), z.literal('down')]),
            }),
        )
        .mutation(() => {}),

    clearVote: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    // Admin
    approve: publicProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .mutation(() => {}),

    reject: publicProcedure
        .input(
            z.object({
                id: z.number(),
                reason: z.string(),
            }),
        )
        .mutation(() => {}),
});
