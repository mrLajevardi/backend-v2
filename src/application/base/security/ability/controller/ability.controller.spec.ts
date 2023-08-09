import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { AbilityAdminService } from '../service/ability-admin.service';

describe('AbilityController', () => {
  let controller: AbilityController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CrudModule, DatabaseModule],
      providers: [AbilityAdminService],
      controllers: [AbilityController],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
