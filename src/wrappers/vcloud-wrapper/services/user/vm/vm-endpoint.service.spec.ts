import { VmEndpointService } from './vm-endpoint.service';
import { TestBed } from '@automock/jest';

describe('VmEndpointService', () => {
  let service: VmEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VmEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
