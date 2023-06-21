import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { GroupsService } from './groups.service';

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsService],
      controllers: [GroupsController],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
