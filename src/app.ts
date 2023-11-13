import http from 'node:http';
import express from 'express';
import { router } from './routes';
import { createWebsocketServer } from 'websocket';

export function createServer() {
  const app = express();
  const server = http.createServer(app);

  createWebsocketServer(server);
  app.use(express.static(__dirname + '/views'));
  app.use(router);

  return server;
}
