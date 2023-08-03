import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsTableService } from './permission-groups-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PermissionGroupsTableService', () => {
  let service: PermissionGroupsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PermissionGroupsTableService, TestDataService],
    }).compile();

    service = module.get<PermissionGroupsTableService>(
      PermissionGroupsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
