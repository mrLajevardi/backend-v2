import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { GroupsTableModule } from '../crud/groups-table/groups-table.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        GroupsTableModule,
        LoggerModule,
      ],
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
