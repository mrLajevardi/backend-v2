import { ServiceAdminService } from '../services/service-admin.service';
import { TestBed } from '@automock/jest';

describe('ServiceAdminService', () => {
  let service: ServiceAdminService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ServiceAdminService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
