import { Test, TestingModule } from '@nestjs/testing';
import { GroupsMappingTableService } from './groups-mapping-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('GroupsMappingTableService', () => {
  let service: GroupsMappingTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [GroupsMappingTableService, TestDataService],
    }).compile();

    service = module.get<GroupsMappingTableService>(GroupsMappingTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
