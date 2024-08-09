import {Redis} from 'ioredis';
import {env} from '../../env.mjs';

export async function createRedisConnection(options?: {
    url?: string;
    connect?: boolean;
}) {
    const redis = new Redis(options?.url ?? env.REDIS_CONNECTION_URL, {
        lazyConnect: true,
    });

    if (options?.connect) {
        await redis.connect();
    }

    return redis;
}
