import { EdgeGatewayService } from './edge-gateway.service';
import { TestBed } from '@automock/jest';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayService;

  beforeEach(async () => {
    const { unit } = TestBed.create(EdgeGatewayService).compile();
    service = unit;
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
