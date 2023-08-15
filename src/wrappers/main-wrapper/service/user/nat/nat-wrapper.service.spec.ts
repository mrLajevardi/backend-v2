import { Test, TestingModule } from '@nestjs/testing';
import { NatWrapperService } from './nat-wrapper.service';

describe('NatWrapperService', () => {
  let service: NatWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatWrapperService],
    }).compile();

    service = module.get<NatWrapperService>(NatWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
