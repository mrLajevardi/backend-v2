import { Test, TestingModule } from '@nestjs/testing';
import { VdcController } from './vdc.controller';
import { BullModule } from '@nestjs/bull';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { ConfigsService } from 'src/application/base/service/configs/configs.service';
import { ServiceInstancesService } from 'src/application/base/service/services/payg.service';
import { ServiceItemsService } from 'src/application/base/service/services/service-items.service';
import { ServicePropertiesService } from 'src/application/base/service/services/service-properties.service';
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
import { ServiceTypesService } from 'src/application/base/service/service-types/service-types.service';
import { DiscountsService } from 'src/application/base/service/services/discounts.service';
import { ServiceChecksService } from 'src/application/base/service/services/service-checks/service-checks.service';
import { QualityPlansService } from 'src/application/base/crud/quality-plans/quality-plans.service';
import { ItemTypesService } from 'src/application/base/service/item-types/item-types.service';
import { ServiceItemsSumService } from 'src/application/base/crud/service-items-sum/service-items-sum.service';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { InvoiceItemsService } from 'src/application/base/invoice/invoice-items/invoice-items.service';
import { InvoiceDiscountsService } from 'src/application/base/invoice/invoice-discounts/invoice-discounts.service';
import { PlansService } from 'src/application/base/plans/plans.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { InvoicePlansService } from 'src/application/base/invoice/invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from 'src/application/base/invoice/invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';

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
        ServiceInstancesService,
        ServicePropertiesService,
        ServiceItemsService,
        ConfigsService,
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
        ServiceTypesService,
        DiscountsService,
        ServiceChecksService,
        QualityPlansService,
        ItemTypesService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsService,
        InvoiceDiscountsService,
        InvoicesChecksService,
        PlansService,
        CostCalculationService,
        InvoicePlansService,
        InvoicePropertiesService,
        VgpuService,
      ],
      controllers: [VdcController],
    }).compile();

    controller = module.get<VdcController>(VdcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
