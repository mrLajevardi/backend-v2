import { Test, TestingModule } from '@nestjs/testing';
import { VdcWrapperService } from './vdc-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('VdcWrapperService', () => {
  let service: VdcWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [VdcWrapperService],
    }).compile();

    service = module.get<VdcWrapperService>(VdcWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
