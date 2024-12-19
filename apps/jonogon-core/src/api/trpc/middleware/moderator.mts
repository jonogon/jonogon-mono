import {TRPCError} from '@trpc/server';
import {middleware} from '../index.mjs';
import {protectedProcedure} from './protected.mjs';

export const isModerator = middleware(async ({ctx, next}) => {
    const user = await ctx.services.postgresQueryBuilder
        .selectFrom('users')
        .select(['is_mod', 'is_admin'])
        .where('id', '=', `${ctx.auth!.user_id}`)
        .executeTakeFirst();

    if (!user?.is_mod && !user?.is_admin) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must be a moderator or admin to perform this action',
        });
    }

    return next({ctx});
});

export const moderatorProcedure = protectedProcedure.use(isModerator); 