import { AITransactionsLogsTableService } from './aitransactions-logs-table.service';
import { TestBed } from '@automock/jest';

describe('AITransactionsLogsTableService', () => {
  let service: AITransactionsLogsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AITransactionsLogsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
