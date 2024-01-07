import { CompanyTableService } from './company-table.service';
import { TestBed } from '@automock/jest';

describe('CompanyTableService', () => {
  let provider: CompanyTableService;

  beforeEach(async () => {
    const { unit } = TestBed.create(CompanyTableService).compile();
    provider = unit;
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
