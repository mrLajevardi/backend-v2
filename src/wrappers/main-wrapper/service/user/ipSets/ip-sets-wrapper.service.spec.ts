import { Test, TestingModule } from '@nestjs/testing';
import { IpSetsWrapperService } from './ip-sets-wrapper.service';

describe('IpSetsWrapperService', () => {
  let service: IpSetsWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpSetsWrapperService],
    }).compile();

    service = module.get<IpSetsWrapperService>(IpSetsWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
