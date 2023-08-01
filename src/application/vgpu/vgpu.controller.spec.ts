import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('VgpuController', () => {
  let controller: VgpuController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [VgpuController],
      providers: [],
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
