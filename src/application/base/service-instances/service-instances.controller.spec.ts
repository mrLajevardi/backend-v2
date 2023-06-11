import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesService } from './service-instances.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DiscountsService } from '../discounts/discounts.service';

describe('ServiceInstancessService', () => {
  let controller: ServiceInstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        ServiceInstancesService,
        ServiceTypesService,
        ServiceInstancesController,
        DiscountsService,
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
