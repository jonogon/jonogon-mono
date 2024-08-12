import {protectedProcedure} from '../../middleware/protected.mjs';
import {z} from 'zod';
import {hash} from 'hasha';

export const invalidateRefreshTokenProcedure = protectedProcedure
    .input(z.object({refreshToken: z.string()}))
    .mutation(async ({input, ctx}) => {
        // TODO: check if the refresh token is in fact the logged-in user's

        const refreshTokenDigest = await hash(input.refreshToken, {
            algorithm: 'sha256',
            encoding: 'hex',
        });

        // TODO: expire the redis key after the refresh token expires
        //       instead of 60 days from now

        await ctx.services.redisConnection.setex(
            `refresh-token:${refreshTokenDigest}:is-invalidated`,
            60 * 25 * 60 * 60, // 60 days from now (temporarily)
            '1',
        );
    });
