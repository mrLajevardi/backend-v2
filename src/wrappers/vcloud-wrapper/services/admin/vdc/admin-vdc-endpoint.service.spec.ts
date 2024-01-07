import { AdminVdcEndpointService } from './admin-vdc-endpoint.service';
import { TestBed } from '@automock/jest';

describe('AdminVdcEndpointService', () => {
  let service: AdminVdcEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminVdcEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
