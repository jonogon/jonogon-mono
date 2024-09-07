import admin from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {decode} from 'universal-base64url';
import {returnOf} from 'scope-utilities';

const firebaseConfig = returnOf(() => {
    if (process.env.NODE_ENV === 'development') {
        return {
            projectId: 'bangladesh2-jonogon',
        };
    }

    if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY_JSON_BASE64URL) {
        return {
            projectId: 'bangladesh2-jonogon',
        };
    }

    const parsed = JSON.parse(
        decode(process.env.FIREBASE_ADMIN_PRIVATE_KEY_JSON_BASE64URL),
    );

    return {
        credential: admin.credential.cert(parsed),
        databaseURL:
            'https://bangladesh2-jonogon-default-rtdb.asia-southeast1.firebasedatabase.app',
    };
});

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
