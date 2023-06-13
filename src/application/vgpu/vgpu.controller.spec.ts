import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';

describe('VgpuController', () => {
  let controller: VgpuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VgpuController],
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
