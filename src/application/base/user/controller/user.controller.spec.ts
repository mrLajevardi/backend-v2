import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { AbilityFactory } from '../../security/ability/ability.factory';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { ACLTableService } from '../../crud/acl-table/acl-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';

describe('UserController', () => {
  let controller: UserController;
  let testDataService: TestDataService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UserController],
      providers: [],
    }).compile();

    controller = module.get<UserController>(UserController);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
