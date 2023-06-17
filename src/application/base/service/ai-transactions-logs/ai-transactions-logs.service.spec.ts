import { Test, TestingModule } from '@nestjs/testing';
import { AiTransactionsLogsService } from './ai-transactions-logs.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('AiTransactionsLogsService', () => {
  let service: AiTransactionsLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AiTransactionsLogsService],
    }).compile();

    service = module.get<AiTransactionsLogsService>(AiTransactionsLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
