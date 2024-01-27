import { StaticRouteWrapperService } from './static-route-wrapper.service';
import { TestBed } from '@automock/jest';

describe('StaticRouteWrapperService', () => {
  let service: StaticRouteWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(StaticRouteWrapperService).compile();
    service = unit;
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
