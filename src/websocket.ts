import { randomUUID } from 'crypto';
import { Server as HttpServer } from 'http';
import { Server as WebsocketServer } from 'socket.io';

const denyList = [ 'VAI SE FUDER', 'VAI TOMAR NO CU', 'STFU' ];
const users: {
  id: string,
  username: string,
  rooms: string[],
}[] = [];

interface ClientToServerMessageData {
  room: string;
  username: string;
  message: string;
}

interface ServerToClientMessageData {
  username: string;
  message: string;
}

interface LoginRequest {
  room: string;
  username: string;
}

interface ClientToServerEvents {
  login: (data: LoginRequest) => void;
  chatMessage: (data: ClientToServerMessageData) => void;
}

interface ServerToClientEvents {
  userAlreadyExists: () => void;
  chatMessage: (data: ServerToClientMessageData) => void;
}

export function createWebsocketServer(server: HttpServer) {
  console.log(' WEBSOCKET  Booting websocket server...')

  const io = new WebsocketServer<
    ClientToServerEvents,
    ServerToClientEvents
  >(server, {
    path: '/ws',
  });

  console.log(' WEBSOCKET  Up! Listening at http://localhost:3333/ws.')

  io.on('connection', (socket) => {
    const id = randomUUID();

    //console.log(` SOCKET (${id})  Connected!`)

    socket.on('disconnect', () => {
      //console.log(` SOCKET (${id})  Disconnected!`);
    });

    socket.on('login', ({ room, username }) => {
      let user = users.find(user => user.username === username);

      if (!user) {
        user = {
          id,
          rooms: [room],
          username,
        }

        users.push(user);
      }

      user.rooms.forEach((room) => {
        socket.join(room);
      });

      console.log(` SOCKET (${username})  Logged in. Rooms: ${user.rooms}.`)
    });

    socket.on('chatMessage', ({ room, username, message }) => {
      const user = users.find(user => user.username === username);

      if (!user) {
        return;
      }

      denyList.forEach((word) => {
        if (message === word) {
          console.log(` SOCKET (${id})  Says '${message}'`)
          message = message.replaceAll(/[A-z]/g, '*');
        }
      });

      io.to(room).emit('chatMessage', { username, message });
    });
  });
}
