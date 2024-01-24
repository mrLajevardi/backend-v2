import { StaticRouteService } from './static-route.service';
import { TestBed } from '@automock/jest';

describe('StaticRouteService', () => {
  let service: StaticRouteService;

  beforeAll(async () => {
    const { unit } = TestBed.create(StaticRouteService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
