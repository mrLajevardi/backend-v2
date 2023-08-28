import { Test, TestingModule } from '@nestjs/testing';
import { IpSetsEndpointService } from './ip-sets-endpoint.service';

describe('IpSetsEndpointService', () => {
  let service: IpSetsEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpSetsEndpointService],
    }).compile();

    service = module.get<IpSetsEndpointService>(IpSetsEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
