import {createEnv} from '@t3-oss/env-core';
import {z} from 'zod';

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['development', 'production']).default('production'),

        // Useful for Railway
        PORT: z
            .string()
            .default('12001')
            .transform((s) => parseInt(s))
            .pipe(z.number()),

        REDIS_CONNECTION_URI: z.string().default('redis://redis:6379'),

        // For use with PostgreSQL
        PGUSER: z.string().default('postgres'),
        PGPASSWORD: z.string().default('postgres'),
        PGHOST: z.string().default('postgres'),
        PGDATABASE: z.string().default('postgres'),

        // For use with R2
        CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
        CLOUDFLARE_ACCESS_KEY_ID: z.string().optional(),
        CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional(),
    },
    runtimeEnv: process.env,
});
