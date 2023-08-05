import { Test, TestingModule } from '@nestjs/testing';
import { PaygInvoiceService } from './payg-invoice.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('PaygInvoiceService', () => {
  let service: PaygInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CrudModule],
      providers: [PaygInvoiceService],
    }).compile();

    service = module.get<PaygInvoiceService>(PaygInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
