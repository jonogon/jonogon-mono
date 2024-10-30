'use client';

import {type PropsWithChildren, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {
    createWSClient,
    httpBatchLink,
    httpLink,
    splitLink,
    wsLink,
} from '@trpc/client';
import {trpc} from './client';
import {scope} from 'scope-utilities';
import {firebaseAuth} from '@/firebase';

export function TRPCWrapper(props: PropsWithChildren<{hostname: string}>) {
    const [queryClient] = useState(() => new QueryClient());

    const [wsClient] = useState(() =>
        createWSClient({
            url:
                process.env.NODE_ENV === 'development'
                    ? `ws://${props.hostname}:12001/ws`
                    : 'wss://core.jonogon.org/ws',
        }),
    );

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                splitLink({
                    condition(op) {
                        return op.type === 'subscription';
                    },
                    true: wsLink({
                        client: wsClient,
                    }),
                    false: splitLink({
                        condition(op) {
                            return op.path === 'auth.refreshToken';
                        },
                        true: httpLink({
                            url:
                                process.env.NODE_ENV === 'development'
                                    ? `http://${props.hostname}:12001/trpc`
                                    : 'https://core.jonogon.org/trpc',
                            headers: async () => {
                                return {};
                            },
                        }),
                        false: httpBatchLink({
                            url:
                                process.env.NODE_ENV === 'development'
                                    ? `http://${props.hostname}:12001/trpc`
                                    : 'https://core.jonogon.org/trpc',
                            headers: async () => {
                                const user = firebaseAuth().currentUser;

                                return scope(
                                    user ? await user.getIdToken() : null,
                                ).let((token) => {
                                    return token
                                        ? {Authorization: `Bearer ${token}`}
                                        : {};
                                });
                            },
                        }),
                    }),
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
