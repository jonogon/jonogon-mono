import {publicProcedure} from '../index.mjs';
import {TContext} from '../context.mjs';
import {TRPCError} from '@trpc/server';

export const protectedProcedure = publicProcedure.use(({ctx, next}) => {
    if (ctx.auth && ctx.auth.user_id) {
        return next({
            ctx: ctx as TContext & {auth: {user_id: number}},
        });
    } else {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
        });
    }
});
