const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const rooms = new Map();
const clients = new Map();

function send(socket, type, payload = {}) {
  if (socket.readyState !== socket.OPEN) return;
  socket.send(JSON.stringify({ type, payload }));
}

function getPeer(room, role) {
  if (role === 'host') return room.guest;
  return room.host;
}

function randomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function createRoomCode() {
  let code = randomCode();
  while (rooms.has(code)) code = randomCode();
  return code;
}

function joinRoom(socket, roomCode, role, playerName) {
  const meta = clients.get(socket);
  meta.roomCode = roomCode;
  meta.role = role;
  meta.playerName = playerName;
}

function leaveRoom(socket) {
  const meta = clients.get(socket);
  if (!meta || !meta.roomCode) return;

  const room = rooms.get(meta.roomCode);
  if (!room) return;

  const peerSocket = getPeer(room, meta.role);
  if (peerSocket) send(peerSocket, 'peer_left');

  if (meta.role === 'host') {
    if (room.guest) {
      const guestMeta = clients.get(room.guest);
      if (guestMeta) {
        guestMeta.roomCode = null;
        guestMeta.role = null;
      }
    }
    rooms.delete(meta.roomCode);
  } else {
    room.guest = null;
    room.guestName = '';
  }

  meta.roomCode = null;
  meta.role = null;
}

const server = http.createServer((req, res) => {
  const safePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const resolvedPath = path.normalize(path.join(ROOT, safePath));

  if (!resolvedPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  clients.set(socket, {
    id: crypto.randomUUID(),
    roomCode: null,
    role: null,
    playerName: '',
  });

  socket.on('message', (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch (error) {
      send(socket, 'error', { message: 'Invalid message payload.' });
      return;
    }

    const meta = clients.get(socket);
    const { type, payload } = message;

    switch (type) {
      case 'create_room': {
        leaveRoom(socket);
        const roomCode = createRoomCode();
        rooms.set(roomCode, {
          code: roomCode,
          host: socket,
          guest: null,
          hostName: payload.playerName,
          guestName: '',
        });
        joinRoom(socket, roomCode, 'host', payload.playerName);
        send(socket, 'room_created', { roomCode, playerName: payload.playerName });
        break;
      }

      case 'join_room': {
        const room = rooms.get(payload.roomCode);
        if (!room) {
          send(socket, 'error', { message: 'Room not found.' });
          return;
        }
        if (room.guest) {
          send(socket, 'error', { message: 'Room is already full.' });
          return;
        }

        leaveRoom(socket);
        room.guest = socket;
        room.guestName = payload.playerName;
        joinRoom(socket, payload.roomCode, 'guest', payload.playerName);

        send(socket, 'room_joined', {
          roomCode: payload.roomCode,
          hostName: room.hostName,
          playerName: payload.playerName,
        });
        send(room.host, 'peer_joined', { guestName: payload.playerName });
        break;
      }

      case 'leave_room':
        leaveRoom(socket);
        break;

      case 'lobby_update':
      case 'host_sync': {
        if (!meta.roomCode || meta.role !== 'host') return;
        const room = rooms.get(meta.roomCode);
        if (!room || !room.guest) return;
        room.hostName = payload.hostName || room.hostName;
        if (payload.guestName) room.guestName = payload.guestName;
        send(room.guest, type, payload);
        break;
      }

      case 'guest_action': {
        if (!meta.roomCode || meta.role !== 'guest') return;
        const room = rooms.get(meta.roomCode);
        if (!room || !room.host) return;
        send(room.host, 'guest_action', payload);
        break;
      }

      default:
        send(socket, 'error', { message: 'Unknown message type.' });
        break;
    }
  });

  socket.on('close', () => {
    leaveRoom(socket);
    clients.delete(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Wyr-Chaos server listening on http://localhost:${PORT}`);
});
