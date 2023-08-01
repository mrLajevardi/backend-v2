import { Test, TestingModule } from '@nestjs/testing';
import { GroupsTableService } from './groups-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('GroupsTableService', () => {
  let service: GroupsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [GroupsTableService, TestDataService],
    }).compile();

    service = module.get<GroupsTableService>(GroupsTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
