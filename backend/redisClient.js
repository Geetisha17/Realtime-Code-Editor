const { createClient } = require('redis');
const  dotenv = require("dotenv");

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379"
});

redisClient.on('error',(err)=>console.log(err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (e) {
    console.error("Redis failed:", e);
  }
}

connectRedis();

export default redisClient;