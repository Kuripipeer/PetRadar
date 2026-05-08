import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from '../config/envs';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
  });

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    const json = JSON.stringify(value);
    await this.redis.set(key, json, 'EX', ttlSeconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
