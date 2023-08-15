import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayWrapperService } from './edge-gateway-wrapper.service';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeGatewayWrapperService],
    }).compile();

    service = module.get<EdgeGatewayWrapperService>(EdgeGatewayWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
