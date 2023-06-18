import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { PlansService } from 'src/application/base/plans/plans.service';
import { ItemTypesService } from 'src/application/base/service/item-types/item-types.service';
import { ServiceTypesService } from 'src/application/base/service/service-types/service-types.service';
import { InvoiceItemsService } from '../../invoice-items/invoice-items.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { InvoicePlansService } from '../../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../../invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ConfigsService } from 'src/application/base/service/configs/configs.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        InvoicesService,
        CostCalculationService,
        InvoicesChecksService,
        PlansService,
        ItemTypesService,
        ServiceTypesService, 
        InvoiceItemsService, 
        TransactionsService, 
        InvoicePlansService, 
        InvoicePropertiesService, 
        VgpuService,
        ConfigsService,
        SessionsService
      ],
      exports:[
        InvoicesService,
        CostCalculationService,
        InvoicesChecksService
      ]
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
