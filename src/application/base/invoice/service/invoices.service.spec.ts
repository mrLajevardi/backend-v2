import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        InvoicesService,
        CostCalculationService,
        InvoicesChecksService,
        PlansTableService,
        ItemTypesTableService,
        ServiceTypesTableService,
        InvoiceItemsTableService,
        TransactionsTableService,
        InvoicePlansTableService,
        InvoicePropertiesTableService,
        VgpuService,
        ConfigsTableService,
        SessionsService,
        InvoicesTableService,
        PlansQueryService,
        SessionsTableService,
      ],
      exports: [InvoicesService, CostCalculationService, InvoicesChecksService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
