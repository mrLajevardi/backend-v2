import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { RoleService } from './role.service';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [RoleService],
      controllers: [RoleController],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
