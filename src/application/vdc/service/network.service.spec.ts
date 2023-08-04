import { Test, TestingModule } from '@nestjs/testing';
import { NetworkService } from './network.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { VdcService } from './vdc.service';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { SessionsTableService } from 'src/application/base/crud/sessions-table/sessions-table.service';
import { ItemTypesTableService } from 'src/application/base/crud/item-types-table/item-types-table.service';
import { PlansTableService } from 'src/application/base/crud/plans-table/plans-table.service';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { ExtendServiceService } from 'src/application/base/service/services/extend-service.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { UserService } from 'src/application/base/user/service/user.service';
import { EdgeService } from './edge.service';
import { OrganizationModule } from 'src/application/base/organization/organization.module';
import { ServiceModule } from 'src/application/base/service/service.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrgService } from './org.service';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';

describe('NetworkService', () => {
  let service: NetworkService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        //TasksModule,
        SessionsModule,
        OrganizationModule,
        UserModule,
        ServiceModule,
        ServicePropertiesModule,
      ],
      providers: [VdcService, OrgService, EdgeService, NetworkService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
