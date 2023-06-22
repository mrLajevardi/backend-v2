import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from './org.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { OrganizationService } from '../../base/organization/organization.service';
import { ConfigsService } from '../../base/service/configs/configs.service';
import { ServiceInstancesService } from '../../base/service/services/payg.service';
import { ServiceItemsService } from '../../base/service/services/service-items.service';
import { ServicePropertiesService } from '../../base/service/services/service-properties.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { TransactionsService } from '../../base/transactions/transactions.service';
import { UserService } from '../../base/user/user.service';
import { VdcService } from './vdc.service';

describe('OrgService', () => {
  let service: OrgService;

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
        OrgService,
      ],
    }).compile();

    service = module.get<OrgService>(OrgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
