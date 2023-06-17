import { Test, TestingModule } from '@nestjs/testing';
import { DebugLogService } from './debug-log.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('DebugLogService', () => {
  let service: DebugLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DebugLogService],
    }).compile();

    service = module.get<DebugLogService>(DebugLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
