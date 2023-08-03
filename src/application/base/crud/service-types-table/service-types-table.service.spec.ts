import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesTableService } from './service-types-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServiceTypesTableService', () => {
  let service: ServiceTypesTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceTypesTableService, TestDataService],
    }).compile();

    service = module.get<ServiceTypesTableService>(ServiceTypesTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
