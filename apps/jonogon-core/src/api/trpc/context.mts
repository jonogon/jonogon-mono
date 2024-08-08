import {inferAsyncReturnType} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as trpcWS from '@trpc/server/adapters/ws';

export async function httpContextCreatorFactory() {
    return async function ({
        req,
    }:
        | trpcExpress.CreateExpressContextOptions
        | trpcWS.CreateWSSContextFnOptions) {
        return {};
    };
}

export type ContextCreator = Awaited<
    ReturnType<typeof httpContextCreatorFactory>
>;

export type Context = inferAsyncReturnType<
    Awaited<ReturnType<typeof httpContextCreatorFactory>>
>;
