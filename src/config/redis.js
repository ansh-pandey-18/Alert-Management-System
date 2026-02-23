import Redis from "ioredis";
import logger from "./logger.js";

let client = null;

const connectRedis = () => {
  client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: "default",
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 10000,
  });

  client.on("ready", () => {
    logger.info("Redis connection established");
  });

  client.on("error", (err) => {
    logger.error(`Redis error: ${err.message}`);
  });

  return client;
};

const getRedisClient = () => client;

export { connectRedis, getRedisClient };