import {Response} from 'express';
import {TRPCError} from '@trpc/server';

interface AuthContext {
    auth?: {
        user_id: number;
        is_user_moderator: boolean;
        is_user_admin: boolean;
    };
}

export function requireAuth(
    ctx: AuthContext,
    res?: Response,
    message: string = 'Unauthorized',
): void {
    if (!ctx.auth?.user_id) {
        if (res) {
            res.status(401).json({message});
            return;
        }
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message,
        });
    }
}

export function requireModeratorOrAdmin(
    ctx: AuthContext,
    res?: Response,
    message: string = 'Forbidden',
): void {
    if (
        !ctx.auth?.user_id ||
        (!ctx.auth.is_user_moderator && !ctx.auth.is_user_admin)
    ) {
        if (res) {
            res.status(403).json({message});
            return;
        }
        throw new TRPCError({
            code: 'FORBIDDEN',
            message,
        });
    }
}

export function requireAdmin(
    ctx: AuthContext,
    res?: Response,
    message: string = 'Forbidden',
): void {
    if (!ctx.auth?.is_user_admin) {
        if (res) {
            res.status(403).json({message});
            return;
        }
        throw new TRPCError({
            code: 'FORBIDDEN',
            message,
        });
    }
}
