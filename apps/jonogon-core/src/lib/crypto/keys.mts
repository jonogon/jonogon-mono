import {scrypt} from 'node:crypto';

export function deriveKey(secret: string, salt: string, keyLength = 256 / 8) {
    return new Promise<Buffer>((accept, reject) =>
        scrypt(secret, salt, keyLength, (err, key) => {
            if (err) {
                reject(err);
            } else {
                accept(key);
            }
        }),
    );
}
