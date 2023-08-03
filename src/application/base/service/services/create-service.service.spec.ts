import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ExtendServiceService } from './extend-service.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/service/user.service';
import { DiscountsService } from './discounts.service';
import { ServiceChecksService } from './service-checks/service-checks.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { QualityPlansService } from '../../crud/quality-plans/quality-plans.service';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { ServiceService } from './service.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { CrudModule } from '../../crud/crud.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TasksModule } from '../../tasks/tasks.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { PaymentModule } from 'src/application/payment/payment.module';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        SessionsModule,
        PaymentModule,
        UserModule,
        forwardRef(() => InvoicesModule),
        TasksModule,
        forwardRef(() => VgpuModule),
        TransactionsModule,
      ],
      providers: [
        CreateServiceService,
        ExtendServiceService,
        ServiceChecksService,
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
