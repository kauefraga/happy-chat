import { Router } from 'express';

export const router = Router();

router.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

router.get('/v1', (request, response) => {
  response.json({
    hello: 'hiiii',
  });
});
