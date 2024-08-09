import {publicProcedure, router} from '../index.mjs';
import {z} from 'zod';

export const userRouter = router({
    getSelf: publicProcedure.query(() => {}),
    updateSelf: publicProcedure
        .input(
            z.object({
                name: z.string(),
            }),
        )
        .mutation(() => {}),
});
