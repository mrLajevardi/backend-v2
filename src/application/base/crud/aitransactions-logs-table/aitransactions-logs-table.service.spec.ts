import { Test, TestingModule } from '@nestjs/testing';
import { AITransactionsLogsTableService } from './aitransactions-logs-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('AITransactionsLogsTableService', () => {
  let service: AITransactionsLogsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [AITransactionsLogsTableService, TestDataService],
    }).compile();

    service = module.get<AITransactionsLogsTableService>(
      AITransactionsLogsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
