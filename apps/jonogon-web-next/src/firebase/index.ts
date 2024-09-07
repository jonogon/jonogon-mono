'use client';

import {type FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth, connectAuthEmulator, type Auth} from 'firebase/auth';
import {getAnalytics} from 'firebase/analytics';
import {decode} from 'universal-base64url';
import {returnOf} from 'scope-utilities';

const firebaseConfig = returnOf(() => {
    const defaultConfig = {
        apiKey: '-----',
        projectId: 'bangladesh2-jonogon',
        appId: '1:162943930438:web:3650066f5b7bd3df37ba47',
    };

    if (process.env.NODE_ENV === 'development') {
        return defaultConfig;
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_WEB_CONFIG_JSON_BASE64URL) {
        return defaultConfig;
    }

    const parsed = JSON.parse(
        decode(process.env.NEXT_PUBLIC_FIREBASE_WEB_CONFIG_JSON_BASE64URL),
    );

    console.log(parsed);

    return parsed;
});

let app: null | FirebaseApp = null;

export const firebaseApp = function () {
    if (!app) {
        app = initializeApp(firebaseConfig);
    }

    return app;
};

let auth: null | Auth = null;

export const firebaseAuth = function () {
    if (!auth) {
        auth = getAuth(firebaseApp());

        if (process.env.NODE_ENV === 'development') {
            connectAuthEmulator(
                auth,
                `http://${window.location.hostname}:12005`,
                {
                    disableWarnings: true,
                },
            );
        }
    }

    return auth;
};
//
// export const firebaseAnalytics = getAnalytics(firebaseApp);
