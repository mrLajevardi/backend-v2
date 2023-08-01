import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('VgpuController', () => {
  let controller: VgpuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [VgpuController],
      providers: [],
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
