import { createServer } from './app';

function bootServer(port: number) {
  console.log(' SERVER  Booting server...');

  const server = createServer();

  server.listen(port, () => {
    console.log(` SERVER  Done! The server is listening at http://localhost:${port}/v1`);
  });
}

bootServer(3333);
