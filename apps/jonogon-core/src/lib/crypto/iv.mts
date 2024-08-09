import {randomBytes} from 'node:crypto';

export function generateIV() {
    return randomBytes(16);
}
