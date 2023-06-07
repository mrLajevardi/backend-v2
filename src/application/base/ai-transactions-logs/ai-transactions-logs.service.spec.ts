import { Test, TestingModule } from '@nestjs/testing';
import { AiTransactionsLogsController } from './ai-transactions-logs.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AiTransactionsLogsService } from './ai-transactions-logs.service';

describe('AiTransactionsLogsController', () => {
  let controller: AiTransactionsLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AiTransactionsLogsService],
      controllers: [AiTransactionsLogsController],
    }).compile();

    controller = module.get<AiTransactionsLogsController>(
      AiTransactionsLogsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
