import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service/service-instances.service';
import { ServiceInstancesController } from './controller/service-instances.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServiceTypesModule } from '../service-types/service-types.module';
import { DiscountsService } from '../discounts/discounts.service';
import { InvoiceDiscountsService } from '../../invoice/invoice-discounts/invoice-discounts.service';
import { AiService } from 'src/application/ai/ai.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { InvoicesService } from '../../invoice/invoices/service/invoices.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { InvoiceItemsService } from '../../invoice/invoice-items/invoice-items.service';
import { UserService } from '../../user/user/user.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { DiscountsModule } from '../discounts/discounts.module';
import { InvoiceDiscountsModule } from '../../invoice/invoice-discounts/invoice-discounts.module';
import { AiModule } from 'src/application/ai/ai.module';
import { ConfigsService } from '../configs/configs.service';
import { CreateServiceService } from './service/create-service/create-service.service';
import { ExtendServiceService } from './service/extend-service/extend-service.service';
import { ServiceChecksService } from './service/service-checks/service-checks.service';
import { PlansService } from '../../plans/plans.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OrganizationService } from '../../organization/organization.service';
import { SessionsModule } from '../../sessions/sessions.module';
import { ServicePropertiesModule } from '../service-properties/service-properties.module';
import { PlansModule } from '../../plans/plans.module';
import { ServiceItemsModule } from '../service-items/service-items.module';
import { ConfigsModule } from '../configs/configs.module';
import { OrganizationModule } from '../../organization/organization.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user/user.module';
import { QualityPlansModule } from '../quality-plans/quality-plans.module';
import { ItemTypesModule } from '../item-types/item-types.module';
import { ServiceItemsSumModule } from '../service-items-sum/service-items-sum.module';
import { InvoicesModule } from '../../invoice/invoices/invoices.module';
import { InvoiceItemsModule } from '../../invoice/invoice-items/invoice-items.module';

@Module({
  imports: [
    DatabaseModule,
    ServiceTypesModule,
    DiscountsModule,
    InvoiceDiscountsModule,
    ServiceTypesModule,
    SessionsModule,
    DiscountsModule,
    ServicePropertiesModule,
    PlansModule,
    ServiceItemsModule,
    ConfigsModule,
    OrganizationModule,
    TransactionsModule,
    UserModule,
    QualityPlansModule,
    ItemTypesModule,
    ServiceItemsSumModule,
    InvoicesModule,
    InvoiceItemsModule
  ],
  providers: [
    ServiceInstancesService,
    CreateServiceService,
    ExtendServiceService,
    ServiceChecksService
  ],
  controllers: [ServiceInstancesController],
  exports: [
    ServiceInstancesService,
    CreateServiceService,
    ExtendServiceService,
    ServiceChecksService
  ]
})
export class ServiceInstancesModule {}
