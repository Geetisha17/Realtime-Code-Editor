const { Server } = require('socket.io');
const { ACTIONS } = require('../../frontend/src/Actions');  

const userSocketMap = {};
const roomCodeMap = {};

function getAllConnectedClients(io, roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);

      const currentCode = roomCodeMap[roomId];
      socket.emit(ACTIONS.CODE_CHANGE, { code: currentCode });

      const clients = getAllConnectedClients(io, roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
          currentCode,
        });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      roomCodeMap[roomId] = code;
      io.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomId }) => {
      const currentCode = roomCodeMap[roomId] || '';
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code: currentCode });
    });

    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });
      delete userSocketMap[socket.id];
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
      delete userSocketMap[socket.id];
    });
  });
}

module.exports = initSocket;