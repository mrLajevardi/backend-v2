import { Module } from '@nestjs/common';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceInstancesController } from './service-instances.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServiceTypesModule } from '../service-types/service-types.module';
import { DiscountsService } from '../discounts/discounts.service';
import { InvoiceDiscountsService } from '../invoice-discounts/invoice-discounts.service';
import { AiService } from 'src/application/ai/ai.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { InvoicesService } from '../invoices/invoices.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { InvoiceItemsService } from '../invoice-items/invoice-items.service';
import { UserService } from '../user/user.service';
import { TransactionsService } from '../transactions/transactions.service';
import { DiscountsModule } from '../discounts/discounts.module';
import { InvoiceDiscountsModule } from '../invoice-discounts/invoice-discounts.module';
import { AiModule } from 'src/application/ai/ai.module';
import { ConfigsService } from '../configs/configs.service';
import { CreateServiceService } from './create-service.service';
import { ExtendServiceService } from './extend-service.service';
import { ServiceChecksService } from './service-checks.service';

@Module({
  imports: [
    DatabaseModule,
    ServiceTypesModule,
    DiscountsModule,
    InvoiceDiscountsModule,
    AiModule,
  ],
  providers: [ServiceInstancesService, ServiceTypesService, DiscountsService, CreateServiceService, ExtendServiceService, ServiceChecksService],
  controllers: [ServiceInstancesController],
})
export class ServiceInstancesModule {}
