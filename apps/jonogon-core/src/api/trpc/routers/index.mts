import {publicProcedure, router} from '../index.mjs';

import {userRouter} from './users.mjs';
import {authRouter} from './auth.mjs';
import {petitionRequestsRouter} from './petition-requests.mjs';

export const appRouter = router({
    _: publicProcedure.query(() => {
        return {
            message: `HELLO FROM jonogon-core's tRPC router!`,
        };
    }),
    auth: authRouter,
    users: userRouter,
    petitionRequests: petitionRequestsRouter,
});

export type TAppRouter = typeof appRouter;
