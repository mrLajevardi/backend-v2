import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { PlansQueryService } from '../../crud/plans-table/plans-query.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';

describe('ServiceService', () => {
  let service: ServiceService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ServiceService,
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
        ServiceItemsTableService,
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
