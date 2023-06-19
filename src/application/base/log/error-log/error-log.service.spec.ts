import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogService } from './error-log.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ErrorLogService', () => {
  let service: ErrorLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ErrorLogService],
    }).compile();

    service = module.get<ErrorLogService>(ErrorLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
