import { Logger } from '@nestjs/common';
import ioredis from 'ioredis';

import { redisConnection } from './redis-connetion';

import 'dotenv/config';

class RedisInstance {
  redis;
  defaultExpiry = 60 * 60; // 1 hours
  constructor() {
    this.connect();
  }

  connect() {
    this.redis = new ioredis(redisConnection());
  }

  private getPrefix(): string {
    if (process.env.NODE_ENV === 'development') {
      return process.env.REDIS_PREFIX + 'dev_';
    }
    if (process.env.NODE_ENV === 'staging') {
      return process.env.REDIS_PREFIX + 'stg_';
    }
    return process.env.REDIS_PREFIX;
  }

  async set(
    key: string,
    value: any,
    exp: number = this.defaultExpiry,
  ): Promise<void> {
    Logger.log(`SET ${key}`, 'REDIS');
    await this.redis.set(key, JSON.stringify(value), 'EX', exp);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (data == null) return null;
    else {
      Logger.log(`GET ${key}`, 'REDIS');
      return JSON.parse(data);
    }
  }

  async del(key: string): Promise<void> {
    Logger.log(`DELETE ${key}`, 'REDIS');
    await this.redis.del(key);
  }

  async getStream(pattern: string): Promise<string[] | void> {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      stream.on('data', (resultKeys) => {
        resolve(resultKeys);
      });
      stream.on('end', () => {
        return resolve();
      });
    });
  }

  async deletePattern(pattern: string): Promise<void> {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      const keys = [];
      stream.on('data', (resultKeys) => {
        if (resultKeys.length > 0) {
          resultKeys.map((key) => {
            keys.push(key.split(prefix)[1]);
          });
        }
      });
      stream.on('end', () => {
        if (keys.length > 0) {
          this.redis.unlink(keys);
          Logger.log(`DELETE PATTERN ${pattern}`, 'REDIS');
        }
        resolve();
      });
    });
  }

  async flushall() {
    await this.redis.flushall();
  }
}

export const Redis = new RedisInstance();
