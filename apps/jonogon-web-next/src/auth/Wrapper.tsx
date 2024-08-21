'use client';

import React, {type PropsWithChildren, useEffect, useState} from 'react';
import {
    AuthStateProvider,
    createTokenManager,
    TokenManagerProvider,
} from '@/auth/token-manager';

export default function AuthWrapper(props: PropsWithChildren) {
    const [authState, setAuthState] = useState<boolean | null>(null);

    const [manager] = useState(() => {
        return createTokenManager({
            prefix: 'auth',
        });
    });

    useEffect(() => {
        manager.onToken((token) => {
            setAuthState(!!token);
        });
    }, [manager, setAuthState]);

    return (
        <AuthStateProvider authState={authState}>
            <TokenManagerProvider manager={manager}>
                {props.children}
            </TokenManagerProvider>
        </AuthStateProvider>
    );
}
