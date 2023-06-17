import { Test, TestingModule } from '@nestjs/testing';
import { VdcService } from './vdc.service';

describe('VdcService', () => {
  let service: VdcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VdcService],
    }).compile();

    service = module.get<VdcService>(VdcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
