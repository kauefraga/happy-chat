const somethingWentWrong = document.getElementById('something-went-wrong');
const header = document.getElementById('header');
const room = document.getElementById('room');
const container = document.getElementById('container');
const form = document.getElementById('form');
const input = document.getElementById('write-message');
const messages = document.getElementById('messages');

const socket = io({
  path: '/ws'
});

const params = new URLSearchParams(window.location.search);
const currentRoom = params.get('room');
const currentUsername = params.get('username');

if (currentRoom && currentUsername) {
  room.textContent = `Sessão #${currentRoom}`;

  socket.emit('login', {
    room: currentRoom,
    username: currentUsername,
  });
} else {
  header.style.display = 'none';
  container.style.display = 'none';
  somethingWentWrong.style.display = 'inline';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('chatMessage', {
      room: currentRoom,
      username: currentUsername,
      message: input.value,
    });

    input.value = '';
  }
});

socket.on('chatMessage', (data) => {
  const messageElement = document.createElement('li');
  const username = document.createElement('strong');
  const message = document.createElement('p');

  username.textContent = `${data.username}`;
  message.textContent = `: ${data.message}`;

  if (currentUsername === data.username) {
    username.style.color = 'var(--light-blue)';
  }

  messageElement.appendChild(username);
  messageElement.appendChild(message);
  messages.appendChild(messageElement);

  window.scrollTo(0, document.body.scrollHeight);
});
