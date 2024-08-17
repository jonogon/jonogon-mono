import {publicProcedure} from '../../index.mjs';
import {z} from 'zod';
import {returnOf} from 'scope-utilities';
import jwt from 'jsonwebtoken';
import {env} from '../../../../env.mjs';
import {TRPCError} from '@trpc/server';
import {hash} from 'hasha';

export const refreshTokenProcedure = publicProcedure
    .input(z.object({refreshToken: z.string()}))
    .mutation(async ({input, ctx}) => {
        const tokenClaims = await returnOf(async () => {
            const decodedToken: any = jwt.verify(
                input.refreshToken,
                env.COMMON_HMAC_SECRET,
                {
                    ignoreNotBefore: env.NODE_ENV === 'development',
                },
            );

            if (!decodedToken) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'invalid refresh token',
                });
            }

            if (!decodedToken?.sub) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'subject not present on token',
                });
            }

            return decodedToken;
        });

        const refreshTokenDigest = await hash(input.refreshToken, {
            algorithm: 'sha256',
            encoding: 'hex',
        });

        const isInvalidated = !!(await ctx.services.redisConnection.exists(
            `refresh-token:${refreshTokenDigest}:is-invalidated`,
        ));

        if (isInvalidated) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'refresh token has been invalidated',
            });
        }

        const accessToken = jwt.sign(
            {
                sub: tokenClaims.sub,
                exp: Math.ceil(Date.now() / 1000) + 1 * 60 * 60, // one hour,

                is_adm: tokenClaims.is_adm,
                is_mod: tokenClaims.is_mod,
            },
            env.COMMON_HMAC_SECRET,
        );

        const refreshToken = jwt.sign(
            {
                sub: tokenClaims.sub,

                nbf: Math.ceil(Date.now() / 1000) + 1 * 55 * 60, // not valid until 5 minutes before access_token expiry.
                exp: Math.ceil(Date.now() / 1000) + 60 * 24 * 60 * 60, // 60 days

                is_adm: tokenClaims.is_adm,
                is_mod: tokenClaims.is_mod,
            },
            env.COMMON_HMAC_SECRET,
        );

        const expiresIn =
            (tokenClaims?.exp ?? Date.now() / 1000) - Date.now() / 1000;

        await ctx.services.redisConnection.setex(
            `refresh-token:${refreshTokenDigest}:is-invalidated`,
            Math.ceil(expiresIn + 60), // a minute after expiry
            '1',
        );

        return {
            access_token: accessToken,
            access_token_validity: 1 * 60 * 60,

            refresh_token: refreshToken,
            refresh_token_validity: 60 * 24 * 60 * 60,
        };
    });
