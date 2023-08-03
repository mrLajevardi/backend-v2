import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesTableService } from './invoice-properties-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicePropertiesTableService', () => {
  let service: InvoicePropertiesTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoicePropertiesTableService, TestDataService],
    }).compile();

    service = module.get<InvoicePropertiesTableService>(
      InvoicePropertiesTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
