import { OrganizationTableService } from './organization-table.service';
import { TestBed } from '@automock/jest';

describe('OrganizationTableService', () => {
  let service: OrganizationTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(OrganizationTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
