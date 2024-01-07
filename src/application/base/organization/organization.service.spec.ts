import { OrganizationService } from './organization.service';
import { TestBed } from '@automock/jest';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeAll(async () => {
    const { unit } = TestBed.create(OrganizationService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
