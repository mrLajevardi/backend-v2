import { Test, TestingModule } from '@nestjs/testing';
import { SystemSettingsTableService } from './system-settings-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('SystemSettingsTableService', () => {
  let service: SystemSettingsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [SystemSettingsTableService, TestDataService],
    }).compile();

    service = module.get<SystemSettingsTableService>(
      SystemSettingsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
