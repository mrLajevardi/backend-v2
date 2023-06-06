import { Test, TestingModule } from '@nestjs/testing';
import { PermissionGroupsController } from './permission-groups.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { PermissionGroupsService } from './permission-groups.service';

describe('PermissionGroupsController', () => {
  let controller: PermissionGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionGroupsService],
      controllers: [PermissionGroupsController],
    }).compile();

    controller = module.get<PermissionGroupsController>(PermissionGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
