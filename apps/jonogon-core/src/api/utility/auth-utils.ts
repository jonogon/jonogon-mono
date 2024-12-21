import {Response} from 'express';

interface AuthContext {
    auth?: {
        user_id?: number;
        is_user_moderator?: boolean;
        is_user_admin?: boolean;
    };
}

// check if user is logged in
export function requireAuth(
    ctx: AuthContext,
    res: Response,
    message: string,
): boolean {
    if (!ctx.auth?.user_id) {
        res.status(401).json({message});
        return false;
    }
    return true;
}

// check if user is self or moderator or admin
export function requireSelfOrModeratorOrAdmin(
    ctx: AuthContext,
    res: Response,
    message: string,
): boolean {
    if (!ctx.auth?.user_id || (!ctx.auth.is_user_moderator && !ctx.auth.is_user_admin)) {
        res.status(403).json({message});
        return false;
    }
    return true;
}

// check if user is self or admin
export function requireSelfOrAdmin(
    ctx: AuthContext,
    res: Response,
    message: string,
): boolean {
    if (!ctx.auth?.user_id || !ctx.auth.is_user_admin) {
        res.status(403).json({message});
        return false;
    }
    return true;
}

// check if user is moderator or admin
export function requireModeratorOrAdmin(
    ctx: AuthContext,
    res: Response,
    message: string,
): boolean {
    if (
        !ctx.auth?.user_id ||
        (!ctx.auth.is_user_moderator && !ctx.auth.is_user_admin)
    ) {
        res.status(403).json({message});
        return false;
    }
    return true;
}

// check if user is admin
export function requireAdmin(ctx: AuthContext, res: Response, message: string): boolean {
    if (!ctx.auth?.is_user_admin) {
        res.status(403).json({message});
        return false;
    }
    return true;
}