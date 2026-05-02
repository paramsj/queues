import IORedis from "ioredis";

const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export {redisConnection};
