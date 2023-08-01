import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayService } from './edge-gateway.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    service = module.get<EdgeGatewayService>(EdgeGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be contain port profile', () => {
    expect(service.applicationPortProfile).toBeDefined();
  });

  it('should be contain firewall', () => {
    expect(service.firewall).toBeDefined();
  });
});
