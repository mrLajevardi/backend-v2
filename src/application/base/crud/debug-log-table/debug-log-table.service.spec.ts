import { DebugLogTableService } from './debug-log-table.service';
import { TestBed } from '@automock/jest';

describe('DebugLogTableService', () => {
  let service: DebugLogTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DebugLogTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
