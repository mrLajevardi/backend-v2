import { Test, TestingModule } from '@nestjs/testing';
import { StaticRouteEndpointService } from './static-route-endpoint.service';

describe('StaticRouteEndpointService', () => {
  let service: StaticRouteEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaticRouteEndpointService],
    }).compile();

    service = module.get<StaticRouteEndpointService>(
      StaticRouteEndpointService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
