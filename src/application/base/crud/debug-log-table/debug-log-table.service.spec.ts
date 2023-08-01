import { Test, TestingModule } from '@nestjs/testing';
import { DebugLogTableService } from './debug-log-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('DebugLogTableService', () => {
  let service: DebugLogTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DebugLogTableService, TestDataService],
    }).compile();

    service = module.get<DebugLogTableService>(DebugLogTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
