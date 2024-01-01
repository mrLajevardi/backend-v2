import { Test, TestingModule } from '@nestjs/testing';
import { NatEndpointService } from './nat-endpoint.service';

describe('NatEndpointService', () => {
  let service: NatEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NatEndpointService],
    }).compile();

    service = module.get<NatEndpointService>(NatEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
