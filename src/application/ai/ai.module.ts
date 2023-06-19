import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserModule } from '../base/user/user/user.module';
import { UserService } from '../base/user/user/user.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { ServiceInstancesService } from '../base/service/service-instances/service/service-instances.service';
import { AiTransactionsLogsService } from '../base/log/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/security/setting/setting.service';
import { ServiceTypesService } from '../base/service/service-types/service-types.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { DiscountsService } from '../base/service/discounts/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { ItemTypesService } from '../base/service/item-types/item-types.service';
import { CreateServiceService } from '../base/service/service-instances/service/create-service/create-service.service';
import { ServiceChecksService } from '../base/service/service-instances/service/service-checks/service-checks.service';
import { PlansService } from '../base/plans/plans.service';
import { ServicePropertiesModule } from '../base/service/service-properties/service-properties.module';
import { ServiceInstancesModule } from '../base/service/service-instances/service-instances.module';
import { ServiceTypesModule } from '../base/service/service-types/service-types.module';
import { AiTransactionsLogsModule } from '../base/log/ai-transactions-logs/ai-transactions-logs.module';
import { SettingModule } from '../base/security/setting/setting.module';
import { DiscountsModule } from '../base/service/discounts/discounts.module';
import { TransactionsModule } from '../base/transactions/transactions.module';
import { ItemTypesModule } from '../base/service/item-types/item-types.module';
import { PlansModule } from '../base/plans/plans.module';
import { ConfigsModule } from '../base/service/configs/configs.module';
import { QualityPlansModule } from '../base/service/quality-plans/quality-plans.module';
import { ServiceItemsSumModule } from '../base/service/service-items-sum/service-items-sum.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ServicePropertiesModule,
    ServiceInstancesModule,
    ServiceTypesModule,
    AiTransactionsLogsModule,
    SettingModule,
    ConfigsModule,
    DiscountsModule,
    TransactionsModule,
    ItemTypesModule,
    PlansModule,
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
