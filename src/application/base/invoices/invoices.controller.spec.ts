import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoicesService } from './invoices.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ConfigsService } from '../configs/configs.service';
import { DiscountsService } from '../discounts/discounts.service';
import { InvoiceItemsService } from '../invoice-items/invoice-items.service';
import { InvoicePlansService } from '../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../invoice-properties/invoice-properties.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { OrganizationService } from '../organization/organization.service';
import { PlansService } from '../plans/plans.service';
import { ServiceChecksService } from '../service-instances/service-checks.service';
import { ServiceInstancesService } from '../service-instances/service-instances.service';
import { ServiceTypesService } from '../service-types/service-types.service';
import { SessionsService } from '../sessions/sessions.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UserService } from '../user/user.service';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;

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
        InvoicesChecksService,
        CostCalculationService,
        InvoiceItemsService,
        TransactionsService,
        InvoicePlansService,
        InvoicePropertiesService,
        VgpuService,
        ServiceChecksService,
        ConfigsService,
        SessionsService,
        DiscountsService,
        ServiceInstancesService,
        UserService,
        OrganizationService,
      ],
      controllers: [InvoicesController],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
