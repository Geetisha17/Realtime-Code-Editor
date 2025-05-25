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
  origin: ['http://localhost:3000' , 'http://realtime-code-editor-application.s3-website-us-east-1.amazonaws.com/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  credentials: true,
}));

app.use('/api/code', codeRoutes);

app.post('/ws', (req, res) => {
  const { action, ...payload } = req.body;

  switch (action) {
    case 'join':
      console.log(`[WS-ACTION] join`, payload);
      return res.status(200).json({ message: 'Join event received' });

    case 'code_change':
      console.log(`[WS-ACTION] code_change`, payload);
      return res.status(200).json({ message: 'Code change received' });

    case 'sync_code':
      console.log(`[WS-ACTION] sync_code`, payload);
      return res.status(200).json({ message: 'Sync request received' });

    case 'joined':
      console.log(`[WS-ACTION] joined`, payload);
      return res.status(200).json({ message: 'User joined event acknowledged' });

    case 'disconnected':
      console.log(`[WS-ACTION] disconnected`, payload);
      return res.status(200).json({ message: 'User disconnected' });

    default:
      console.warn(`[WS-ACTION] Unknown action: ${action}`);
      return res.status(400).json({ error: 'Unknown action' });
  }
});

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});