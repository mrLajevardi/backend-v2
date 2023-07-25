import { Test, TestingModule } from '@nestjs/testing';
import { ExtendServiceService } from './extend-service.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
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

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ExtendServiceService,
        ItemTypesTableService,
        PlansTableService,
        ServiceTypesTableService,
        ConfigsTableService,
        ServiceItemsTableService,
        ServiceInstancesTableService,
        ServicePropertiesTableService,
        SessionsService,
        UserService,
        OrganizationService,
        TransactionsService,
        DiscountsTableService,
        ServiceInstancesTableService,
        ItemTypesTableService,
        ServiceTypesTableService,
        ServicePropertiesTableService,
        InvoiceDiscountsTableService,
        ServiceService,
        PlansTableService,
        ConfigsTableService,
        ServiceItemsTableService,
        SessionsTableService,
        UserTableService,
        OrganizationTableService,
        TransactionsTableService,
        InvoicesTableService,
        InvoiceItemsTableService,
        InvoicePlansTableService,
        InvoicePropertiesTableService,
        PlansQueryService,
      ],
    }).compile();

    service = module.get<ExtendServiceService>(ExtendServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
