import { AdminOrgWrapperService } from './admin-org-wrapper.service';
import { TestBed } from '@automock/jest';

describe('AdminOrgWrapperService', () => {
  let service: AdminOrgWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminOrgWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
