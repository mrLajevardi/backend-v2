import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CompanyTableService } from '../../crud/company-table/company-table.service';
import { DatabaseModule } from '../../../../infrastructure/database/database.module';
import { ProvinceTableService } from '../../crud/province-table/province-table.service';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ProvinceTableService, CompanyTableService, CompanyService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
