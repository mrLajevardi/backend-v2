import { Test, TestingModule } from '@nestjs/testing';
import { VdcWrapperService } from './vdc-wrapper.service';

describe('VdcWrapperService', () => {
  let service: VdcWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VdcWrapperService],
    }).compile();

    service = module.get<VdcWrapperService>(VdcWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
