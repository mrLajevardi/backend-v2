import { Test, TestingModule } from '@nestjs/testing';
import { VmDeleteWrapperService } from './vm-delete-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('VmDeleteWrapperService', () => {
  let service: VmDeleteWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [VmDeleteWrapperService],
    }).compile();

    service = module.get<VmDeleteWrapperService>(VmDeleteWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
