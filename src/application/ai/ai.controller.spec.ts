import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AiService } from './ai.service';
import { UserService } from '../base/user/user.service';
import { DiscountsService } from '../base/service/services/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { CreateServiceService } from '../base/service/services/create-service.service';
import { ServiceChecksService } from '../base/service/services/service-checks/service-checks.service';
import { QualityPlansService } from '../base/crud/quality-plans/quality-plans.service';
import { InvoicesService } from '../base/invoice/service/invoices.service';
import { ServiceItemsSumService } from '../base/crud/service-items-sum/service-items-sum.service';
import { InvoicesChecksService } from '../base/invoice/service/invoices-checks.service';
import { CostCalculationService } from '../base/invoice/service/cost-calculation.service';
import { VgpuService } from '../vgpu/vgpu.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { InvoiceDiscountsTableService } from '../base/crud/invoice-discounts-table/invoice-discounts-table.service';
import { InvoiceItemsTableService } from '../base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../base/crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../base/crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../base/crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../base/crud/service-types-table/service-types-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { DiscountsTableService } from '../base/crud/discounts-table/discounts-table.service';
import { PlansQueryService } from '../base/crud/plans-table/plans-query.service';
import { ServiceInstancesStoredProcedureService } from '../base/crud/service-instances-table/service-instances-stored-procedure.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { TransactionsTableService } from '../base/crud/transactions-table/transactions-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { ServiceService } from '../base/service/services/service.service';
import { InvoicesTableService } from '../base/crud/invoices-table/invoices-table.service';
import { AitransactionsLogsStoredProcedureService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-stored-procedure.service';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AiService,
        UserService,
        ServicePropertiesTableService,
        ServiceInstancesTableService,
        ServiceTypesTableService,
        AITransactionsLogsTableService,
        SettingTableService,
        ConfigsTableService,
        DiscountsService,
        TransactionsService,
        ItemTypesTableService,
        CreateServiceService,
        ServiceChecksService,
        PlansTableService,
        QualityPlansService,
        ServiceItemsTableService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsTableService,
        InvoiceDiscountsTableService,
        InvoicesChecksService,
        CostCalculationService,
        InvoicePlansTableService,
        InvoicePropertiesTableService,
        VgpuService,
        SessionsService,
        SessionsService,
        UserTableService,
        ServiceInstancesStoredProcedureService,
        UserTableService,
        DiscountsTableService,
        TransactionsTableService,
        ServiceService,
        PlansQueryService,
        UserTableService,
        SessionsTableService,
        InvoicesTableService,
        AitransactionsLogsStoredProcedureService,
        PayAsYouGoService,
      ],
      controllers: [AiController],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
