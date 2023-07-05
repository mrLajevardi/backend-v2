import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayService } from './edge-gateway.service';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeGatewayService],
    }).compile();

    service = module.get<EdgeGatewayService>(EdgeGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
