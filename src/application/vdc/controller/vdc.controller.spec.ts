import { Test, TestingModule } from '@nestjs/testing';
import { VdcController } from './vdc.controller';
import { BullModule } from '@nestjs/bull';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { UserService } from 'src/application/base/user/user.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { EdgeService } from '../service/edge.service';
import { NetworkService } from '../service/network.service';
import { OrgService } from '../service/org.service';
import { VdcService } from '../service/vdc.service';
import { CreateServiceService } from 'src/application/base/service/services/create-service.service';
import { DiscountsService } from 'src/application/base/service/services/discounts.service';
import { ServiceChecksService } from 'src/application/base/service/services/service-checks/service-checks.service';
import { QualityPlansService } from 'src/application/base/crud/quality-plans/quality-plans.service';
import { ServiceItemsSumService } from 'src/application/base/crud/service-items-sum/service-items-sum.service';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { InvoiceDiscountsTableService } from 'src/application/base/crud/invoice-discounts-table/invoice-discounts-table.service';
import { InvoiceItemsTableService } from 'src/application/base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from 'src/application/base/crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from 'src/application/base/crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from 'src/application/base/crud/item-types-table/item-types-table.service';
import { PlansTableService } from 'src/application/base/crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { SessionsTableService } from 'src/application/base/crud/sessions-table/sessions-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { DiscountsTableService } from 'src/application/base/crud/discounts-table/discounts-table.service';
import { ExtendServiceService } from 'src/application/base/service/services/extend-service.service';
import { ServiceService } from 'src/application/base/service/services/service.service';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { PlansQueryService } from 'src/application/base/crud/plans-table/plans-query.service';

describe('VdcController', () => {
  let controller: VdcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
      ],
      providers: [
        VdcService,
        OrganizationService,
        ServiceInstancesTableService,
        ServicePropertiesTableService,
        ServiceItemsTableService,
        ConfigsTableService,
        OrganizationService,
        UserService,
        SessionsService,
        TransactionsService,
        TasksService,
        EdgeService,
        TaskManagerService,
        OrgService,
        NetworkService,
        CreateServiceService,
        ServiceTypesTableService,
        DiscountsService,
        ServiceChecksService,
        QualityPlansService,
        ItemTypesTableService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsTableService,
        InvoiceDiscountsTableService,
        InvoicesChecksService,
        PlansTableService,
        CostCalculationService,
        InvoicePlansTableService,
        InvoicePropertiesTableService,
        VgpuService,
        OrganizationTableService,
        UserTableService,
        SessionsTableService,
        TransactionsTableService,
        TasksTableService,
        VdcService,
        OrganizationService,
        UserService,
        TransactionsService,
        EdgeService,
        ExtendServiceService,
        ItemTypesTableService,
        PlansTableService,
        ServiceTypesTableService,
        ConfigsTableService,
        ServiceItemsTableService,
        ServiceInstancesTableService,
        ServicePropertiesTableService,
        SessionsService,
        OrganizationTableService,
        UserTableService,
        TransactionsTableService,
        SessionsTableService,
        DiscountsTableService,
        ServiceService,
        InvoicesTableService,
        PlansQueryService,
      ],
      controllers: [VdcController],
    }).compile();

    controller = module.get<VdcController>(VdcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
