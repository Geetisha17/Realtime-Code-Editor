const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const codeRoutes = require('./routes/codeRoutes');
const initSocket = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use('/', codeRoutes);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});