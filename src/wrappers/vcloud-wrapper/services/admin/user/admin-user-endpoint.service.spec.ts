import { AdminUserEndpointService } from './admin-user-endpoint.service';
import { TestBed } from '@automock/jest';

describe('AdminUserEndpointService', () => {
  let service: AdminUserEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminUserEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
