import {publicProcedure, router} from '../index.mjs';

export const appRouter = router({
    _: publicProcedure.query(() => {
        return {
            message: `HELLO FROM jonogon-core's tRPC router!`,
        };
    }),
});

export type AppRouter = typeof appRouter;
