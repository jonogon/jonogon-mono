import {createWriteStream} from 'node:fs';
import {TFileStorageService} from './type.mjs';

export function createLocalFileStorageService(): TFileStorageService {
    return {
        async storeFile(path, stream) {
            const writeStream = createWriteStream(`/jonogon-static/${path}`);
            stream.pipe(writeStream);

            return new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
        },
        async getFileURL(path) {
            return `http://$CORE_HOSTNAME:12001/static/${path}`;
        },
    };
}
