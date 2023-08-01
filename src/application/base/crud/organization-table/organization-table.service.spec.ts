import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationTableService } from './organization-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('OrganizationTableService', () => {
  let service: OrganizationTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OrganizationTableService, TestDataService],
    }).compile();

    service = module.get<OrganizationTableService>(OrganizationTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
