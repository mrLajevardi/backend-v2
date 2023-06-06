import { Test, TestingModule } from '@nestjs/testing';
import { InfoLogController } from './info-log.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InfoLogService } from './info-log.service';

describe('InfoLogController', () => {
  let controller: InfoLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InfoLogService],
      controllers: [InfoLogController],
    }).compile();

    controller = module.get<InfoLogController>(InfoLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
