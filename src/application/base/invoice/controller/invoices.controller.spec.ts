import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoicesService } from '../service/invoices.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { SessionsService } from '../../sessions/sessions.service';
import { CostCalculationService } from '../service/cost-calculation.service';
import { InvoicesChecksService } from '../service/invoices-checks.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
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
        SessionsTableService,
        InvoicesTableService,
        PlansQueryService,
      ],
      controllers: [InvoicesController],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
