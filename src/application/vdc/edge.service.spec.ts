import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { OrganizationService } from '../base/organization/organization.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { ServiceInstancesService } from '../base/service/service-instances/service/service-instances.service';
import { ServiceItemsService } from '../base/service/service-items/service-items.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { UserService } from '../base/user/user/user.service';
import { VdcService } from './vdc.service';

describe('EdgeService', () => {
  let service: EdgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
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
        EdgeService,
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
