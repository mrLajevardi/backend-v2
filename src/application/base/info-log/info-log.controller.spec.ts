import { Test, TestingModule } from '@nestjs/testing';
import { InfoLogService } from './info-log.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InfoLogService', () => {
  let service: InfoLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InfoLogService],
    }).compile();

    service = module.get<InfoLogService>(InfoLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
