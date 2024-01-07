import { AdminOrgEndpointService } from './admin-org-endpoint.service';
import { TestBed } from '@automock/jest';

describe('AdminOrgEndpointService', () => {
  let service: AdminOrgEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminOrgEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
