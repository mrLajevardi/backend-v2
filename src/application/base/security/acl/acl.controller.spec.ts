import { Test } from '@nestjs/testing';
import { AclController } from './acl.controller';
import { AclService } from './acl.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserService } from '../../user/user/user.service';

describe('AclController', () => {
  let controller: AclController;
  let aclService: AclService;
  let testDataService: TestDataService;
  let userService: UserService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [AclController],
      providers: [AclService, UserService],
    }).compile();

    controller = module.get<AclController>(AclController);
    aclService = module.get<AclService>(AclService);
    testDataService = module.get<TestDataService>(TestDataService);
    userService = module.get<UserService>(UserService);

    await testDataService.seedTestData();
  });

  describe('findAll', () => {
    it('should return an array of ACL records', async () => {
      const response = await controller.findAll();
      expect(response).toBeInstanceOf(Array);
    });
  });
});
