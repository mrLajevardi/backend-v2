import { Test, TestingModule } from '@nestjs/testing';
import { VdcService } from './vdc.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { OrganizationService } from '../../base/organization/organization.service';
import { ServiceInstancesService } from '../../base/service/service-instances/service/service-instances.service';
import { ConfigsService } from '../../base/service/configs/configs.service';
import { ServiceItemsService } from '../../base/service/service-items/service-items.service';
import { ServicePropertiesService } from '../../base/service/service-properties/service-properties.service';
import { UserService } from '../../base/user/user/user.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { TransactionsService } from '../../base/transactions/transactions.service';

describe('VdcService', () => {
  let service: VdcService;

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
      ],
    }).compile();

    service = module.get<VdcService>(VdcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
