import {createTRPCReact} from '@trpc/react-query';
import type {TAppRouter} from '@jonogon/core';
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';

export const trpc = createTRPCReact<TAppRouter>();
