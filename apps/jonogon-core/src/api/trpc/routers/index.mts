import {publicProcedure, router} from '../index.mjs';

import {userRouter} from './users.mjs';
import {authRouter} from './auth.mjs';
import {petitionRouter} from './petitions.mjs';
import {commentRouter} from './comments.mjs';

export const appRouter = router({
    _: publicProcedure.query(() => {
        return {
            message: `HELLO FROM jonogon-core's tRPC router!`,
        };
    }),
    auth: authRouter,
    users: userRouter,
    petitions: petitionRouter,
    comments: commentRouter,
});

export type TAppRouter = typeof appRouter;
