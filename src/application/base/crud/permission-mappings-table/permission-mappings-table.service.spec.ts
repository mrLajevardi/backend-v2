import { Test, TestingModule } from '@nestjs/testing';
import { PermissionMappingsTableService } from './permission-mappings-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PermissionMappingsTableService', () => {
  let service: PermissionMappingsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PermissionMappingsTableService, TestDataService],
    }).compile();

    service = module.get<PermissionMappingsTableService>(
      PermissionMappingsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
