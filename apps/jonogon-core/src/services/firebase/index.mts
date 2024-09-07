import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {decode} from 'universal-base64url';

const firebaseConfig = process.env.FIREBASE_ADMIN_PRIVATE_KEY_JSON_BASE64URL
    ? JSON.parse(decode(process.env.FIREBASE_ADMIN_PRIVATE_KEY_JSON_BASE64URL))
    : {
          projectId: 'bangladesh2-jonogon',
      };

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
