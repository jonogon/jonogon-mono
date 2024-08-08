import {createServer} from 'node:http';
import {WebSocketServer} from 'ws';
import express from 'express';
import {env} from './env.mjs';

const expressApp = express();
const server = createServer(expressApp);

const wsServer = new WebSocketServer({
    server: server,
    path: '/ws',
});

server.listen(env.PORT, '0.0.0.0', () => {
    console.log(`🚂 EXPRESS: 🎛️  API: ✅ LISTENING ON http://0.0.0.0:${env.PORT}/`);
});

