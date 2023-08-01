import { Test, TestingModule } from '@nestjs/testing';
import { AitransactionsLogsStoredProcedureService } from './aitransactions-logs-stored-procedure.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('AitransactionsLogsStoredProcedureService', () => {
  let service: AitransactionsLogsStoredProcedureService;
  let module : TestingModule; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [AitransactionsLogsStoredProcedureService],
    }).compile();

    service = module.get<AitransactionsLogsStoredProcedureService>(
      AitransactionsLogsStoredProcedureService,
    );
  });

  afterAll(async () => { await module.close(); });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
