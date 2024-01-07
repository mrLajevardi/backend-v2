import { SessionsService } from './sessions.service';
import { TestBed } from '@automock/jest';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SessionsService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
