import {publicProcedure, router} from '../index.mjs';

import {userRouter} from './users.mjs';
import {authRouter} from './auth.mjs';
import {petitionsRouter} from './petitions.mjs';

export const appRouter = router({
    _: publicProcedure.query(() => {
        return {
            message: `HELLO FROM jonogon-core's tRPC router!`,
        };
    }),
    auth: authRouter,
    users: userRouter,
    petitions: petitionsRouter,
});

export type AppRouter = typeof appRouter;
