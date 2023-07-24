import { Test, TestingModule } from '@nestjs/testing';
import { AbilityAdminController } from './ability-admin.controller';

describe('AbilityAdminController', () => {
  let controller: AbilityAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilityAdminController],
    }).compile();

    controller = module.get<AbilityAdminController>(AbilityAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
