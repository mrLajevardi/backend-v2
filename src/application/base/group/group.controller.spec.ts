import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { GroupsTableModule } from '../crud/groups-table/groups-table.module';
import { GroupModule } from './group.module';
import { GroupService } from './group.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [
        DatabaseModule,
        GroupsTableModule,
        LoggerModule
      ],
      providers:[
        GroupService,
      ],
      controllers: [GroupController],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
