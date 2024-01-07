import { SessionsTableService } from './sessions-table.service';
import { TestBed } from '@automock/jest';

describe('SessionsTableService', () => {
  let service: SessionsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SessionsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
