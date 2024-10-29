'use client';

import React, {type PropsWithChildren, useEffect, useState} from 'react';
import {AuthStateProvider} from '@/auth/token-manager';
import {firebaseAuth} from '@/firebase';

export default function AuthWrapper(props: PropsWithChildren) {
    const [authState, setAuthState] = useState<boolean | null>(null);

    useEffect(() => {
        firebaseAuth().onAuthStateChanged((state) => {
            setAuthState(!!state);
        });
    }, [setAuthState]);


    return (
        <AuthStateProvider authState={authState}>
            {props.children}
        </AuthStateProvider>
    );
}
