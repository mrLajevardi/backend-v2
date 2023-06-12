import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceService } from './create-service.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ExtendServiceService } from './extend-service.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { ConfigsService } from '../configs/configs.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { SessionsService } from '../sessions/sessions.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { DiscountsService } from '../discounts/discounts.service';
import { ServiceChecksService } from './service-checks.service';
import { PlansService } from '../plans/plans.service';

describe('CreateServiceService', () => {
  let service: CreateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        CreateServiceService,
        ExtendServiceService,
        ItemTypesService,
        ConfigsService,
        ServiceItemsService,
        ServiceTypesService,
        DiscountsService,
        ServiceInstancesService,
        ServiceChecksService,
        PlansService,
        ServicePropertiesService,
        SessionsService,
        UserService,
        OrganizationService
      ],
    }).compile();

    service = module.get<CreateServiceService>(CreateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
