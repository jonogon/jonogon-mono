import {createCipheriv} from 'node:crypto';

export function encrypt(
    key: Buffer,
    iv: Buffer,
    data: string,
    algorithm = 'aes-256-cbc',
    encoding: BufferEncoding = 'base64',
) {
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', encoding);
    encrypted += cipher.final(encoding);

    return encrypted;
}
