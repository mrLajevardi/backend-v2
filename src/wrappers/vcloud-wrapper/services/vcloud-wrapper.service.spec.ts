import { Test, TestingModule } from '@nestjs/testing';
import { VcloudWrapperService } from './vcloud-wrapper.service';

describe('VcloudWrapperService', () => {
  let service: VcloudWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VcloudWrapperService],
    }).compile();

    service = module.get<VcloudWrapperService>(VcloudWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
