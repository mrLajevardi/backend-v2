import { Test, TestingModule } from '@nestjs/testing';
import { DebugLogController } from './debug-log.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { DebugLogService } from './debug-log.service';

describe('DebugLogController', () => {
  let controller: DebugLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DebugLogService],
      controllers: [DebugLogController],
    }).compile();

    controller = module.get<DebugLogController>(DebugLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
