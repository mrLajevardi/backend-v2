import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { isNil } from 'lodash';
@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: string, time?: number): Promise<void> {
    await this.cacheManager.set(key, value, time);
  }

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async exist(key: string): Promise<boolean> {
    return Promise.resolve(!isNil(await this.get(key)));
  }
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
