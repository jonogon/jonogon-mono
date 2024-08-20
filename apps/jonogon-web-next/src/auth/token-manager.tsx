'use client';

import {
    createContext,
    type PropsWithChildren,
    useContext,
    useState,
} from 'react';
import {returnOf} from 'scope-utilities';
import AwaitLock from 'await-lock';

export type TRefreshFunc = (options: {refreshToken: string}) => Promise<
    {
        accessToken: string;
        accessTokenValidity: number;
    } & (
        | {
              refreshToken: string;
              refreshTokenValidity: number;
          }
        | {}
    )
>;

export type TTokenListener = (token: string | null) => void;

export function createTokenManager({
    prefix = 'token-manager',
    refreshOffset = 2 * 60 * 1000,
}: {
    prefix?: string;
    refreshOffset?: number;
}) {
    let refreshLock: null | AwaitLock = null;

    const listeners = new Set<TTokenListener>();
    let refreshFunc: TRefreshFunc | null = null;

    function setRefreshFunc(func: TRefreshFunc) {
        refreshFunc = func;
    }

    async function setToken(
        options: {
            accessToken: string;
            accessTokenValidity: number;
        } & (
            | {
                  refreshToken: string;
                  refreshTokenValidity: number;
              }
            | {}
        ),
    ): Promise<string> {
        window.localStorage.setItem(
            `${prefix}:token`,
            JSON.stringify({
                expiresAt: Date.now() + options.accessTokenValidity,
                token: options.accessToken,
            }),
        );

        if ('refreshToken' in options) {
            window.localStorage.setItem(
                `${prefix}:refresh-token`,
                JSON.stringify({
                    expiresAt: Date.now() + options.refreshTokenValidity,
                    refreshToken: options.refreshToken,
                }),
            );
        }

        listeners.forEach((listener) => listener(options.accessToken));
        return options.accessToken;
    }

    async function refreshToken() {
        if (!refreshLock) {
            refreshLock = new AwaitLock();
        }

        await refreshLock.acquireAsync();

        try {
            const refreshToken = window.localStorage.getItem(
                `${prefix}:refresh-token`,
            );

            if (!refreshToken) {
                return null;
            }

            const parsedRefreshToken = JSON.parse(refreshToken) as {
                expiresAt: number;
                refreshToken: string;
            };

            if (Date.now() > parsedRefreshToken.expiresAt) {
                return null;
            }

            if (!refreshFunc) {
                return null;
            }

            const nextTokenInfo = await refreshFunc({
                refreshToken: parsedRefreshToken.refreshToken,
            });

            if (
                'refreshToken' in nextTokenInfo &&
                nextTokenInfo.refreshTokenValidity ===
                    nextTokenInfo.accessTokenValidity
            ) {
                console.warn(
                    'Refresh token, and access token has the same validity, are you sure you want to do this?',
                );
            }

            return await setToken(nextTokenInfo);
        } catch {
            return null;
        } finally {
            refreshLock.release();
        }
    }

    async function getToken(options?: {
        forceRefresh?: boolean;
    }): Promise<string | null> {
        const token = await returnOf(async () => {
            const token = window.localStorage.getItem(`${prefix}:token`);

            if (!token || options?.forceRefresh) {
                return await refreshToken();
            }

            const parsedToken = JSON.parse(token) as {
                expiresAt: number;
                token: string;
            };

            if (Date.now() > parsedToken.expiresAt - refreshOffset) {
                return await refreshToken();
            }

            return parsedToken.token;
        });

        listeners.forEach((listener) => listener(token));
        return token;
    }

    function onToken(listener: TTokenListener) {
        listeners.add(listener);
        getToken();

        return () => {
            listeners.delete(listener);
        };
    }

    function removeTokens() {
        window.localStorage.removeItem(`${prefix}:token`);
        window.localStorage.removeItem(`${prefix}:refresh-token`);

        listeners.forEach((listener) => listener(null));
    }

    return {
        get: getToken,
        set: setToken,
        setRefreshFunc: setRefreshFunc,
        onToken: onToken,
        signout: removeTokens,
    };
}

export type TTokenManager = ReturnType<typeof createTokenManager>;

export const tokenManagerContext = createContext<TTokenManager | null>(null);

export function TokenManagerProvider({
    manager,
    children,
}: PropsWithChildren<{
    manager: TTokenManager;
}>) {
    return (
        <tokenManagerContext.Provider value={manager}>
            {children}
        </tokenManagerContext.Provider>
    );
}

export function useTokenManager(): TTokenManager {
    const context = useContext(tokenManagerContext);

    if (!context) {
        throw new Error('token manager context not found');
    }

    return context;
}

export const authStateContext = createContext<boolean | null>(null);

export function AuthStateProvider({
    authState,
    children,
}: PropsWithChildren<{
    authState: boolean | null;
}>) {
    return (
        <authStateContext.Provider value={authState}>
            {children}
        </authStateContext.Provider>
    );
}

export function useAuthState() {
    return useContext(authStateContext);
}
