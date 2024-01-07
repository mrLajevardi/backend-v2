import { IpSetsEndpointService } from './ip-sets-endpoint.service';
import { TestBed } from '@automock/jest';

describe('IpSetsEndpointService', () => {
  let service: IpSetsEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(IpSetsEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
