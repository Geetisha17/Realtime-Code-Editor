const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { ACTIONS } = require('../Actions');

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || [] ).map((socketId)=>{
        return {
            socketId,
            username : userSocketMap[socketId],
        }
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
    allowedHeaders: ['Content-Type']
}));


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN , ({roomId , username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
                    io.to(socketId).emit(ACTIONS.JOINED,{
                        clients,
                        username,
                        socketId : socket.id,
                    });
        })
        
    })

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        delete userSocketMap[socket.id];
    });
});

app.get('/compile', (req, res) => {
    console.log("GET request to /compile");
    res.send({ output: 'Output of the executed code' }); 
});

app.post('/compile', (req, res) => {
    const { language, script } = req.body;

    const program = {
        script: script,
        language: language,
        versionIndex: "0",
        clientId: "97b63abb86f4cf9326c2643bd93d25c9",
        clientSecret: "4be49679e4106419ea9894c846ffab09bf721ae3a475fcc88a19c1f1566fea7"
    };

    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
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
