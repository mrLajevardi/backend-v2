import { Test, TestingModule } from '@nestjs/testing';
import { ExtendServiceService } from './extend-service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/service/user.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { ServiceService } from './service.service';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { OrganizationModule } from '../../organization/organization.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { CreateServiceService } from './create-service.service';
import { DeleteServiceService } from './delete-service.service';
import { DiscountsService } from './discounts.service';
import { PayAsYouGoService } from './pay-as-you-go.service';
import { ServiceChecksService } from './service-checks/service-checks.service';

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        SessionsModule,
        UserModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
        LoggerModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        TransactionsModule,
        VdcModule,
      ],
      providers: [
        ExtendServiceService,
        ServiceService,
        PayAsYouGoService,
        CreateServiceService,
        ExtendServiceService,
        DiscountsService,
        ServiceChecksService,
        DeleteServiceService,
        TaskManagerService,
        TasksService,
        NetworkService,
      ],
    }).compile();

    service = module.get<ExtendServiceService>(ExtendServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
