import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [GroupController],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
