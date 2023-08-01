import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsMappingsTableService } from './permission-groups-mappings-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PermissionGroupsMappingsTableService', () => {
  let service: PermissionGroupsMappingsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PermissionGroupsMappingsTableService, TestDataService],
    }).compile();

    service = module.get<PermissionGroupsMappingsTableService>(
      PermissionGroupsMappingsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
