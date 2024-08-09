import {createPostgresPool} from './db/connectors/postgres/index.mjs';
import {createRedisConnection} from './db/connectors/redis/index.mjs';
import {logger} from './logger.mjs';

export async function createServices() {
    const postgresPool = createPostgresPool();

    logger.debug('connecting to redis');
    const redisConnection = createRedisConnection({connect: true});
    logger.info('connected to redis');

    return {
        postgresPool,
        redisConnection,
    };
}

export type TServices = Awaited<ReturnType<typeof createServices>>;
