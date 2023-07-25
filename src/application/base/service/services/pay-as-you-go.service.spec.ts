import { Test, TestingModule } from '@nestjs/testing';
import { PayAsYouGoService } from './pay-as-you-go.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { OrganizationService } from '../../organization/organization.service';
import { SessionsService } from '../../sessions/sessions.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UserService } from '../../user/service/user.service';
import { ExtendServiceService } from './extend-service.service';
import { SessionsTableService } from '../../crud/sessions-table/sessions-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';

describe('PayAsYouGoService', () => {
  let service: PayAsYouGoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        PayAsYouGoService,
        TransactionsTableService,
        UserTableService,
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
        SessionsTableService,
        OrganizationTableService,
      ],
    }).compile();

    service = module.get<PayAsYouGoService>(PayAsYouGoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
