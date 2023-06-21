import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogController } from './error-log.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ErrorLogService } from './error-log.service';

describe('ErrorLogController', () => {
  let controller: ErrorLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ErrorLogService],
      controllers: [ErrorLogController],
    }).compile();

    controller = module.get<ErrorLogController>(ErrorLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
