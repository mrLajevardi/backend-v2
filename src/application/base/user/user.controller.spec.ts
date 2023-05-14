import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TestDBProviders } from 'src/infrastructure/test-utils/providers';
import { AbilityFactory } from '../ability/ability.factory';
import { AclService } from '../acl/acl.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        AbilityFactory,
        AclService,
        TestDBProviders.userProvider,
        TestDBProviders.aclProvider
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
