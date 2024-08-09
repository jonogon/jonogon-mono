import {randomBytes} from 'node:crypto';

export function generateSalt() {
    return randomBytes(16).toString('hex');
}
