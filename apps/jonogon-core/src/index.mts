import {createServer} from 'node:http';
import {WebSocketServer} from 'ws';
import express from 'express';
import {env} from './env.mjs';
import {httpContextCreatorFactory} from './api/trpc/context.mjs';
import {registerHTTPRoutes} from './api/http/index.mjs';
import {registerWSHandlers} from './api/websocket/index.mjs';

const expressApp = express();
const server = createServer(expressApp);
const createHTTPContext = await httpContextCreatorFactory();

const wsServer = new WebSocketServer({
    server: server,
    path: '/ws',
});

await registerHTTPRoutes(expressApp, createHTTPContext);
await registerWSHandlers(wsServer, createHTTPContext);

server.listen(env.PORT, '0.0.0.0', () => {
    console.log(
        `🚂 EXPRESS: 🎛️  API: ✅ LISTENING ON http://0.0.0.0:${env.PORT}/`,
    );
});
