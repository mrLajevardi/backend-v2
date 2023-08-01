import { Test, TestingModule } from '@nestjs/testing';
import { ServicePropertiesTableService } from './service-properties-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServicePropertiesTableService', () => {
  let service: ServicePropertiesTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServicePropertiesTableService, TestDataService],
    }).compile();

    service = module.get<ServicePropertiesTableService>(
      ServicePropertiesTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
