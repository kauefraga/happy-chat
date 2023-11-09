import http from 'node:http';
import express from 'express';
import { router } from './routes';
import { Server } from 'socket.io';

export function createServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    path: '/ws'
  });

  app.use(router);

  io.on('connection', (socket) => {
    console.log(' WEBSOCKET  New connection!')

    socket.on('disconnect', () => {
      console.log(` SOCKET (${socket.id})  Disconnected!`);
    });

    socket.on('chat message', (message: string) => {
      console.log(` SOCKET (${socket.id})  Message: ${message}`);
    });

    socket.on('chat message', (message: string) => {
      const denyList = [ 'VAI SE FUDER', 'VAI TOMAR NO CU', 'STFU' ];

      for (let i = 0; i < denyList.length; i++) {
        if (message === denyList[i]) {
          console.log(` SOCKET (${socket.id})  Says '${message}'`)
          message = '****';
        }
      }

      io.emit('chat message', socket.id, message);
    });
  });

  return server;
}
