import { EdgeGatewayWrapperService } from './edge-gateway-wrapper.service';
import { TestBed } from '@automock/jest';

describe('EdgeGatewayService', () => {
  let service: EdgeGatewayWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(EdgeGatewayWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
