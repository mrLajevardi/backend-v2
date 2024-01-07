import { RedisCacheService } from './redis-cache.service';
import { TestBed } from '@automock/jest';

describe('RedisCacheService', () => {
  let service: RedisCacheService;

  beforeAll(async () => {
    const { unit } = TestBed.create(RedisCacheService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
