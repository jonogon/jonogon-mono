import {
    AuthStateProvider,
    createTokenManager,
    TokenManagerProvider,
} from './token-manager.tsx';
import {type PropsWithChildren, useEffect, useState} from 'react';

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
