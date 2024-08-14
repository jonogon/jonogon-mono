import {TFileStorageService} from './type.mjs';
import {env} from '../../env.mjs';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';

export function createR2FileStorageService(): TFileStorageService {
    if (
        !env.CLOUDFLARE_ENDPOINT ||
        !env.CLOUDFLARE_ACCESS_KEY_ID ||
        !env.CLOUDFLARE_SECRET_ACCESS_KEY
    ) {
        throw new Error('missing Cloudflare credentials');
    }

    const r2 = new S3Client({
        region: 'auto',
        endpoint: env.CLOUDFLARE_ENDPOINT,
        credentials: {
            accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
            secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
        },
    });

    return {
        async storeFile(path, stream) {
            await r2.send(
                new PutObjectCommand({
                    Bucket: 'banglacuts-storage',
                    Key: path,
                    Body: stream,
                }),
            );
        },
        async getFileURL(path) {
            return `https://static.jonogon.org/${path}`;
        },
    };
}
