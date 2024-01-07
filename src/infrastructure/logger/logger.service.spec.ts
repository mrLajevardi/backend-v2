import { LoggerService } from './logger.service';
import { TestBed } from '@automock/jest';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeAll(async () => {
    const { unit } = TestBed.create(LoggerService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
