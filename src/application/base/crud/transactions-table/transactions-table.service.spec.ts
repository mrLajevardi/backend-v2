import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsTableService } from './transactions-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('TransactionsTableService', () => {
  let service: TransactionsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TransactionsTableService, TestDataService],
    }).compile();

    service = module.get<TransactionsTableService>(TransactionsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
