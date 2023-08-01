import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
