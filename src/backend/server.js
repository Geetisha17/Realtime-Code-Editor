const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { ACTIONS } = require('../Actions');

const userSocketMap = {};
const roomCodeMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
}));

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
        console.log(`User ${username} joining room ${roomId}`);
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const currentCode = roomCodeMap[roomId];
        socket.emit(ACTIONS.CODE_CHANGE,{code:currentCode});
      
        // const roomCode = roomCodeMap[roomId] || '';
        // io.to(roomId).emit(ACTIONS.SYNC_CODE, {
        //   socketId: socket.id,
        //   code: roomCode
        // });
      
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
          io.to(socketId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
            currentCode
          });
        });
      
        console.log(`User ${username} socket id is ${socket.id} room ${roomId}`);
      });
      

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        roomCodeMap[roomId] = code;
        io.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId , roomId}) => {       
        const currentCode = roomCodeMap[roomId] || '';
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code:currentCode });
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

app.get('/compile', (req, res) => {
    res.send({ output: 'Output of the executed code' });
});

app.post('/compile', (req, res) => {
    const { language, script } = req.body;

    const program = {
        script: script,
        language: language,
        versionIndex: "0",
        clientId: "97b63abb86f4cf9326c2643bd93d25c9",
        clientSecret: "4be49679e4106419ea9894c846ffab09bf721ae3a475fcc88a19c1f1566fea7",
    };

    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program,
    }, function (error, response, body) {
        if (error) {
            res.status(500).send({ error: 'Error executing code' });
        } else {
            res.status(response.statusCode).send(body);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
