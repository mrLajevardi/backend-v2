import { VdcEndpointService } from './vdc-endpoint.service';
import { TestBed } from '@automock/jest';

describe('VdcEndpointService', () => {
  let service: VdcEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(VdcEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
