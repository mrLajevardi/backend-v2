import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ExtendServiceService } from './extend-service.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/user.service';
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
import { DeleteServiceService } from './delete-service.service';

describe('DeleteServiceService', () => {
  let service: DeleteServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DeleteServiceService],
    }).compile();

    service = module.get<DeleteServiceService>(DeleteServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
