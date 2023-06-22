import { Test, TestingModule } from '@nestjs/testing';
import { AitransactionsLogsStoredProcedureService } from './aitransactions-logs-stored-procedure.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('AitransactionsLogsStoredProcedureService', () => {
  let service: AitransactionsLogsStoredProcedureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:  [TestDatabaseModule],
      providers: [AitransactionsLogsStoredProcedureService],
    }).compile();

    service = module.get<AitransactionsLogsStoredProcedureService>(AitransactionsLogsStoredProcedureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
