import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesService } from './invoice-properties.service';

describe('InvoicePropertiesService', () => {
  let service: InvoicePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicePropertiesService],
    }).compile();

    service = module.get<InvoicePropertiesService>(InvoicePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
