import {inferAsyncReturnType, TRPCError} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpcWS from '@trpc/server/adapters/ws';
import {TServices} from '../../services.mjs';
import {returnOf} from 'scope-utilities';
import jwt from 'jsonwebtoken';
import {env} from '../../env.mjs';

export async function httpContextCreatorFactory(services: TServices) {
    return async function ({
        req,
    }:
        | trpcExpress.CreateExpressContextOptions
        | trpcWS.CreateWSSContextFnOptions) {
        const authContext = await returnOf(async () => {
            const header = req?.headers['authorization'];

            if (!header) {
                return;
            }

            const bearerToken = header.split('Bearer ')[1];

            if (!bearerToken) {
                return;
            }

            const decoded = jwt.verify(bearerToken, env.COMMON_HMAC_SECRET);

            if (!decoded) {
                return;
            }

            if (!decoded?.sub) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'subject not present on token',
                });
            }

            return {
                auth: {
                    user_id: Number(decoded.sub),
                },
            };
        });

        return {
            ...authContext,
            services,
        };
    };
}

export type TContextCreator = Awaited<
    ReturnType<typeof httpContextCreatorFactory>
>;

export type TContext = inferAsyncReturnType<
    Awaited<ReturnType<typeof httpContextCreatorFactory>>
>;
