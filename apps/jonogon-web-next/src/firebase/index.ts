'use client';

import {type FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth, connectAuthEmulator, type Auth} from 'firebase/auth';
import {getAnalytics} from 'firebase/analytics';
import {decode} from 'universal-base64url';

const firebaseConfig = process.env.FIREBASE_WEB_CONFIG_JSON_BASE64URL
    ? JSON.parse(decode(process.env.FIREBASE_WEB_CONFIG_JSON_BASE64URL))
    : {
          apiKey: '-----',
          projectId: 'bangladesh2-jonogon',
          authDomain: 'bangladesh2-jonogon.firebaseapp.com',
          storageBucket: 'bangladesh2-jonogon.appspot.com',
          messagingSenderId: '162943930438',
          appId: '1:162943930438:web:3650066f5b7bd3df37ba47',
          measurementId: 'G-BY995Q5BBE',
      };

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
