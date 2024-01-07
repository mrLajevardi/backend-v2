import { TransactionsService } from './transactions.service';
import { TestBed } from '@automock/jest';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeAll(async () => {
    const { unit } = TestBed.create(TransactionsService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
