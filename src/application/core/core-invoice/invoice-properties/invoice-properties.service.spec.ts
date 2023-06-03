import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesService } from './invoice-properties.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoicePropertiesService', () => {
  let service: InvoicePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicePropertiesService],
    }).compile();

    service = module.get<InvoicePropertiesService>(InvoicePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
