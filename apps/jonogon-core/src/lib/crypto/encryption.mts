import {createCipheriv, createDecipheriv} from 'node:crypto';

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

export function decrypt(
    key: Buffer,
    iv: Buffer,
    data: string,
    algorithm = 'aes-256-cbc',
    inputEncoding: BufferEncoding = 'base64',
    outputEncoding: BufferEncoding = 'utf8',
) {
    const cipher = createDecipheriv(algorithm, key, iv);

    let decrypted = cipher.update(data, inputEncoding, outputEncoding);
    decrypted += cipher.final(outputEncoding);

    return decrypted;
}
