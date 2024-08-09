import {createHmac} from 'node:crypto';

export async function hmac(
    data: string,
    secret: string,
    algorithm = 'sha256',
    encoding: 'hex' | 'base64' = 'hex',
) {
    const hmac = createHmac(algorithm, secret);
    hmac.update(data);

    return hmac.digest(encoding);
}
