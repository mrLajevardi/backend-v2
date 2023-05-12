import { Test, TestingModule } from '@nestjs/testing';
import { VastController } from './vast.controller';

describe('VastController', () => {
  let controller: VastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VastController],
    }).compile();

    controller = module.get<VastController>(VastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
