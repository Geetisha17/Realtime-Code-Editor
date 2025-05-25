const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis successfully');
});

async function connectRedis() {
  try
  {
    if (!client.isReady) {
      await client.connect();
      console.log("Redis client connected");
    }
  }catch(err)
  {
    console.log(err.message);
  }
}

async function ensureConnected()
{
  if(!client.isOpen)
      await client.connect();
}

module.exports = {
  ensureConnected,
  connectRedis,
  redisClient: client,
};