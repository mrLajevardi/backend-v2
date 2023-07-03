import { Test, TestingModule } from '@nestjs/testing';
import { VgpuController } from './vgpu.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('VgpuController', () => {
  let controller: VgpuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [VgpuController],
      providers: [],
    }).compile();

    controller = module.get<VgpuController>(VgpuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
