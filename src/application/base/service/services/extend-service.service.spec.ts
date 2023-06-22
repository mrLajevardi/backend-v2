import { Test, TestingModule } from '@nestjs/testing';
import { ExtendServiceService } from './extend-service.service';
import { ItemTypesService } from '../../../item-types/item-types.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ConfigsService } from '../../../configs/configs.service';
import { ServiceItemsService } from '../service-items.service';
import { ServiceInstancesService } from '../payg.service';
import { ServiceTypesService } from '../../../service-types/service-types.service';
import { ServicePropertiesService } from '../service-properties.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { UserService } from '../../user/user.service';
import { PlansService } from '../../../../plans/plans.service';
import { TransactionsService } from '../../transactions/transactions.service';

describe('ExtendServiceService', () => {
  let service: ExtendServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ExtendServiceService,
        ItemTypesService,
        PlansService,
        ServiceTypesService,
        ConfigsService,
        ServiceItemsService,
        ServiceInstancesService,
        ServicePropertiesService,
        SessionsService,
        UserService,
        OrganizationService,
        TransactionsService,
      ],
    }).compile();

    service = module.get<ExtendServiceService>(ExtendServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
