import { Test, TestingModule } from '@nestjs/testing';
import { VgpuService } from './vgpu.service';

describe('VgpuService', () => {
  let service: VgpuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VgpuService],
    }).compile();

    service = module.get<VgpuService>(VgpuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
