import { Test, TestingModule } from '@nestjs/testing';
import { SettingTableService } from './setting-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('SettingTableService', () => {
  let service: SettingTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SettingTableService, TestDataService],
    }).compile();

    service = module.get<SettingTableService>(SettingTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
