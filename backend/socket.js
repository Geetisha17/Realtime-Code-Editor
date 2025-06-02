const { Server } = require('socket.io');
const  ACTIONS  = require('./Actions');
const userSocketMap = {};
const roomCodeMap = {};

function getAllConnectedClients(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId) || new Set();
  return Array.from(room).map(socketId => ({
    socketId,
    username: userSocketMap[socketId] || 'Anonymous',
  }));
}

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["https://code-sync-zeta-five.vercel.app", "http://localhost:3000"],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      if (!roomId || !username) {
        console.warn('Invalid join request', { roomId, username });
        return;
      }

      userSocketMap[socket.id] = username;
      console.log("Added user:", username);
      socket.join(roomId);

      const currentCode = roomCodeMap[roomId] || '';
      socket.emit(ACTIONS.CODE_CHANGE, { code: currentCode });

      const clients = getAllConnectedClients(io, roomId);
      console.log(`Clients in room ${roomId}:`, clients);

      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
          currentCode,
        });
      });
      console.log("emitting join to all clients", clients);
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      roomCodeMap[roomId] = code;
      io.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId }) => {
      const currentCode = roomCodeMap[roomId] || '';
      console.log(`SYNC_CODE works ${socketId} for ${roomId}`)
      console.log(`>>> sync code recieved ${currentCode}`);
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: currentCode });
    });

    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms].filter(r => r !== socket.id);

      rooms.forEach(roomId => {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id] || 'Anonymous',
        });

        console.log(`${userSocketMap[socket.id]} (${socket.id}) left room ${roomId}`);
      });
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
      delete userSocketMap[socket.id];
    });
  });
}

module.exports = { initSocket };
