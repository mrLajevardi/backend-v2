import { Test, TestingModule } from '@nestjs/testing';
import { VdcService } from './vdc.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { OrganizationService } from '../../base/organization/organization.service';
import { UserService } from '../../base/user/user.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { TransactionsService } from '../../base/transactions/transactions.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { SessionsTableService } from 'src/application/base/crud/sessions-table/sessions-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { ItemTypesTableService } from 'src/application/base/crud/item-types-table/item-types-table.service';
import { PlansTableService } from 'src/application/base/crud/plans-table/plans-table.service';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { ExtendServiceService } from 'src/application/base/service/services/extend-service.service';
import { EdgeService } from './edge.service';

describe('VdcService', () => {
  let service: VdcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        VdcService,
        OrganizationService,
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
        
      ],
    }).compile();

    service = module.get<VdcService>(VdcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
