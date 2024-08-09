import {inferAsyncReturnType} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpcWS from '@trpc/server/adapters/ws';
import {TServices} from '../../services.mjs';

export async function httpContextCreatorFactory(services: TServices) {
    return async function ({
        req,
    }:
        | trpcExpress.CreateExpressContextOptions
        | trpcWS.CreateWSSContextFnOptions) {
        return {
            services,
        };
    };
}

export type ContextCreator = Awaited<
    ReturnType<typeof httpContextCreatorFactory>
>;

export type Context = inferAsyncReturnType<
    Awaited<ReturnType<typeof httpContextCreatorFactory>>
>;
