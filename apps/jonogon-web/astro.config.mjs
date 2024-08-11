import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 12002,
	},
	integrations: [react(), tailwind()],
	output: 'server',
	adapter: vercel(),
});
