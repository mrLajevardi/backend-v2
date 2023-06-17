import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesService } from './service-instances.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DiscountsService } from '../discounts/discounts.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UserService } from '../../user/user/user.service';

describe('ServiceInstancessService', () => {
  let controller: ServiceInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ServiceInstancesController,
        ServiceInstancesService,
        ServiceTypesService,
        ServiceItemsService,
        ServicePropertiesService,
        DiscountsService,
        TransactionsService,
        UserService,
      ],
    }).compile();

    controller = module.get<ServiceInstancesController>(
      ServiceInstancesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
