import { EdgeGatewayController } from './edge-gateway.controller';
import { TestBed } from '@automock/jest';

describe('EdgeGatewayController', () => {
  let controller: EdgeGatewayController;

  beforeAll(async () => {
    const { unit } = TestBed.create(EdgeGatewayController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
