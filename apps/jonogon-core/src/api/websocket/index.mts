import {applyWSSHandler} from '@trpc/server/adapters/ws';
import {appRouter, TAppRouter} from '../trpc/routers/index.mjs';
import {type WebSocketServer} from 'ws';
import {ContextCreator} from '../trpc/context.mjs';

export async function registerWSHandlers(
    websocketServer: WebSocketServer,
    createContext: ContextCreator,
) {
    applyWSSHandler<TAppRouter>({
        wss: websocketServer,
        router: appRouter,
        createContext: createContext,
    });
}
