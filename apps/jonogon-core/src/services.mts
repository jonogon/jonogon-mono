import {createPostgresPool} from './db/postgres/index.mjs';
import {createRedisConnection} from './db/redis/index.mjs';
import {logger} from './logger.mjs';
import {env} from './env.mjs';
import {createSSLSMSService} from './services/sms/sslSMSService.mjs';
import {createConsoleSMSService} from './services/sms/consoleSMSService.mjs';
import {createPostgresQueryBuilder} from './db/postgres/query-builder.mjs';

export async function createServices() {
    const postgresPool = await createPostgresPool();

    logger.debug('connecting to redis');
    const redisConnection = await createRedisConnection({connect: true});
    logger.info('connected to redis');

    const smsService =
        env.NODE_ENV === 'development'
            ? createConsoleSMSService()
            : createSSLSMSService();

    const postgresQueryBuilder = createPostgresQueryBuilder(postgresPool);

    return {
        postgresPool,
        postgresQueryBuilder,
        redisConnection,
        smsService,
    };
}

export type TServices = Awaited<ReturnType<typeof createServices>>;
