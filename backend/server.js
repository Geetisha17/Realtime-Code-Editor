const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const codeRoutes = require('./routes/codeRoutes');
const {initSocket} = require('./socket');
dotenv.config();
const { connectRedis } = require('./redisClient');
(async()=>{
  await connectRedis();
})();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000' ,
     'http://realtime-code-editor-application.s3-website-us-east-1.amazonaws.com/',
  'http://44.203.254.128:5000',
'https://realtime-code-editor-w71x.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  credentials: true,
}));

app.use('/api/code', codeRoutes);

initSocket(server);

server.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});