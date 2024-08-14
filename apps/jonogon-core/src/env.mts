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

        REDIS_CONNECTION_URL: z.string().default('redis://redis:6379'),

        // For use with PostgreSQL
        DATABASE_URL: z.string(),

        // For use with R2
        CLOUDFLARE_ENDPOINT: z.string().optional(),
        CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
        CLOUDFLARE_ACCESS_KEY_ID: z.string().optional(),
        CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional(),

        BULKSMSBD_API_KEY: z.string().optional(),

        COMMON_HMAC_SECRET: z.string(),
        COMMON_ENCRYPTION_SECRET: z.string(),
    },
    runtimeEnv: process.env,
});
