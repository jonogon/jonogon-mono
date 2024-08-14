import {createPostgresPool} from './db/postgres/index.mjs';
import {createRedisConnection} from './db/redis/index.mjs';
import {logger} from './logger.mjs';
import {env} from './env.mjs';
import {createConsoleSMSService} from './services/sms/consoleSMSService.mjs';
import {createPostgresQueryBuilder} from './db/postgres/query-builder.mjs';
import {createBulksmsbdSMSService} from './services/sms/bulksmsbdSMSService.mjs';
import {createLocalFileStorageService} from './services/file-storage/localFileStorageService.mjs';
import {createR2FileStorageService} from './services/file-storage/r2FileStorageService.mjs';

export async function createServices() {
    const postgresPool = await createPostgresPool();

    logger.debug('connecting to redis');
    const redisConnection = await createRedisConnection({connect: true});
    logger.info('connected to redis');

    const smsService =
        env.NODE_ENV === 'development'
            ? createConsoleSMSService()
            : createBulksmsbdSMSService();

    const fileStorageService =
        env.NODE_ENV === 'development'
            ? createLocalFileStorageService()
            : createR2FileStorageService();

    const postgresQueryBuilder = createPostgresQueryBuilder(postgresPool);

    return {
        postgresPool,
        postgresQueryBuilder,
        redisConnection,
        smsService: smsService,
        fileStorage: fileStorageService,
    };
}

export type TServices = Awaited<ReturnType<typeof createServices>>;
