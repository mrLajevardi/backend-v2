import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserModule } from '../base/user/user.module';
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

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AiController],
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
})
export class AiModule {}
