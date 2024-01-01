import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { GroupsTableModule } from '../crud/groups-table/groups-table.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

describe('GroupService', () => {
  let service: GroupService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, GroupsTableModule, LoggerModule],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
