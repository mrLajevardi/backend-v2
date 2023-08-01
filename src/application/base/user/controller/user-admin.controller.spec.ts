import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './user-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('UserAdminController', () => {
  let controller: UserAdminController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UserAdminController],
    }).compile();

    controller = module.get<UserAdminController>(UserAdminController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
