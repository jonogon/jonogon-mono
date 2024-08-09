import {publicProcedure, router} from '../index.mjs';
import {z} from 'zod';

export const petitionsRouter = router({
    // CRUD
    list: publicProcedure.query(() => {}),
    get: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(() => {}),
    create: publicProcedure.mutation(() => {}),
    submit: publicProcedure.mutation(() => {}),

    update: publicProcedure.mutation(() => {}),
    removeImage: publicProcedure.mutation(() => {}),
    removeFile: publicProcedure.mutation(() => {}),

    remove: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    // Skibidi
    listComments: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(() => {}),

    addComment: publicProcedure
        .input(
            z.object({
                id: z.string(),
                comment: z.string(),
            }),
        )
        .mutation(() => {}),

    vote: publicProcedure
        .input(
            z.object({
                id: z.string(),
                vote: z.union([z.literal('up'), z.literal('down')]),
            }),
        )
        .mutation(() => {}),

    clearVote: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    reportAsBaseless: publicProcedure.mutation(() => {
        // Gujob
    }),

    // Admin
    approve: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    reject: publicProcedure
        .input(
            z.object({
                id: z.string(),
                reason: z.string(),
            }),
        )
        .mutation(() => {}),

    pin: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    unpin: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),

    escalate: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(() => {}),
});
