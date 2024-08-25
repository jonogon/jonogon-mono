import type {TAppRouter} from '@jonogon/core';
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';

export const trpcVanilla = createTRPCProxyClient<TAppRouter>({
    links: [
        httpBatchLink({
            url:
                process.env.NODE_ENV === 'development'
                    ? typeof window === 'undefined'
                        ? 'http://localhost:12001/trpc'
                        : `http://${window.location.hostname}:12001/trpc`
                    : 'https://core.jonogon.org/trpc',
        }),
    ],
});
