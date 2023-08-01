import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { ServicePlansTableService } from './service-plans-table.service';

describe('ServicePlansTableService', () => {
  let service: ServicePlansTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServicePlansTableService, TestDataService],
    }).compile();

    service = module.get<ServicePlansTableService>(ServicePlansTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
