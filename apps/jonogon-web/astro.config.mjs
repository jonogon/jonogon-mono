import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    devToolbar: {
        enabled: false,
    },
    server: {
        host: '0.0.0.0',
        port: 12002,
    },
    integrations: [react(), tailwind()],
    output: 'server',
    adapter: cloudflare(),
});
