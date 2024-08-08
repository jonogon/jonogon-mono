import {type Express} from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import {ContextCreator} from '../trpc/context.mjs';
import {appRouter} from '../trpc/routers/index.mjs';
import {env} from '../../env.mjs';

export async function registerHTTPRoutes(
    expressApp: Express,
    createContext: ContextCreator,
) {
    const app = expressApp;

    app.get('/', (req, res) => {
        res.json({
            message: 'HELLO FROM jonogon-core!',
        });
    });

    app.use(
        '/trpc',
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        }),
    );

    if (env.NODE_ENV === 'development') {
        const trpcPlayground = await import('trpc-playground/handlers/express');

        app.use(
            '/trpc-playground',
            await trpcPlayground.expressHandler({
                trpcApiEndpoint: '/trpc',
                playgroundEndpoint: '/trpc-playground',
                router: appRouter,
            }),
        );
    }
}
