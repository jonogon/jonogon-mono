import {createTRPCReact} from '@trpc/react-query';
import type {TAppRouter} from '@jonogon/core';

export const trpc = createTRPCReact<TAppRouter>();
