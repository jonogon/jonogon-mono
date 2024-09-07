import {inferAsyncReturnType, TRPCError} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpcWS from '@trpc/server/adapters/ws';
import {TServices} from '../../services.mjs';
import {returnOf} from 'scope-utilities';
import {firebaseAuth} from '../../services/firebase/index.mjs';

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

            const decoded = await firebaseAuth.verifyIdToken(bearerToken);

            if (!decoded) {
                return;
            }

            if (!decoded.uid) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'uid not present on token',
                });
            }

            return {
                auth: {
                    user_id: Number(decoded.uid),

                    is_user_admin: !!decoded.is_admin,
                    is_user_moderator: !!decoded.is_mod,
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
