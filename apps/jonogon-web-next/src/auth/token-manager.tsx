'use client';

import {createContext, type PropsWithChildren, useContext} from 'react';
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
