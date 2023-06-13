import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AiService } from './ai.service';
import { UserService } from '../base/user/user.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { ServiceInstancesService } from '../base/service-instances/service-instances.service';
import { AiTransactionsLogsService } from '../base/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/setting/setting.service';
import { ServiceTypesService } from '../base/service-types/service-types.service';
import { ConfigsService } from '../base/configs/configs.service';
import { DiscountsService } from '../base/discounts/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { ItemTypesService } from '../base/item-types/item-types.service';
import { CreateServiceService } from '../base/service-instances/create-service.service';
import { ServiceChecksService } from '../base/service-instances/service-checks.service';
import { PlansService } from '../base/plans/plans.service';

describe('AiController', () => {
  let controller: AiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AiService,
        UserService,
        ServicePropertiesService,
        ServiceInstancesService,
        ServiceTypesService,
        AiTransactionsLogsService,
        SettingService,
        ConfigsService,
        DiscountsService,
        TransactionsService,
        ItemTypesService,
        CreateServiceService,
        ServiceChecksService,
        PlansService,
      ],
      controllers: [AiController],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
