const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL ,
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
    if (!client.isOpen) {
      await client.connect();
      console.log("Redis client connected");
    }
  }catch(err)
  {
    console.log("Reddis not connected", err.message);
  }
}

async function ensureConnected()
{
  if(!client.isReady)
      await client.connect();
}

module.exports = {
  ensureConnected,
  connectRedis,
  redisClient: client,
};