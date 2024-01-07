import { TransactionsTableService } from './transactions-table.service';
import { TestBed } from '@automock/jest';

describe('TransactionsTableService', () => {
  let service: TransactionsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TransactionsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
