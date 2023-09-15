import { RedisOptions } from 'ioredis';

import 'dotenv/config';

const getPrefix = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REDIS_PREFIX + 'dev_';
  }
  if (process.env.NODE_ENV === 'staging') {
    return process.env.REDIS_PREFIX + 'stg_';
  }
  return process.env.REDIS_PREFIX;
};

export const redisConnection = (): RedisOptions => {
  return {
    port: Number(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD || undefined,
    keyPrefix: getPrefix(),
    enableAutoPipelining: true,
    // enableReadyCheck: true,
  };
};
