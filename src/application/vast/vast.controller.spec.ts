import { Test, TestingModule } from '@nestjs/testing';
import { VastController } from './vast.controller';
import { AbilityModule } from '../base/ability/ability.module';

describe('VastController', () => {
  let controller: VastController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AbilityModule],
      controllers: [VastController],
    }).compile();

    controller = module.get<VastController>(VastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
