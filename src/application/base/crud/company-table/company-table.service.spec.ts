import { Test, TestingModule } from '@nestjs/testing';
import { CompanyTableService } from './company-table.service';

describe('CompanyTableService', () => {
  let provider: CompanyTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyTableService],
    }).compile();

    provider = module.get<CompanyTableService>(CompanyTableService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
