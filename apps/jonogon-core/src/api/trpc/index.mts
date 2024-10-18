import {initTRPC} from '@trpc/server';
import type {TContext} from './context.mjs';

const t = initTRPC.context<TContext>().create({});

export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
