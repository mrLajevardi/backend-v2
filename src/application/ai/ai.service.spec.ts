import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { UserService } from '../base/user/user.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { ServiceInstancesService } from '../base/service-instances/service-instances.service';
import { AiTransactionsLogsService } from '../base/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/setting/setting.service';
import { ServiceTypesService } from '../base/service-types/service-types.service';
import { ConfigsService } from '../base/configs/configs.service';
import { DiscountsService } from '../base/discounts/discounts.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AiService,
        UserService,
        DiscountsService,
        ServicePropertiesService,
        ServiceInstancesService,
        ServiceTypesService,
        AiTransactionsLogsService,
        SettingService,
        ConfigsService
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
