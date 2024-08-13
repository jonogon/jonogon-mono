import type {TContext} from '../../context.mjs';

export const getNumberOfAttempts = async (
    ctx: TContext,
    key: string,
    ttl: number,
): Promise<number> => {
    return (await ctx.services.redisConnection.eval(
        // this is lua code
        `
            local current
            current = redis.call("incr", KEYS[1])
            
            -- only run the expire command on first run
            if current == 1 then
                -- expire the key after 1 hour
                redis.call("expire", KEYS[1], ARGV[1])
            end
            
            return current
        `,
        1,
        key,
        ttl,
    )) as number;
};
