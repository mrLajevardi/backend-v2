import { Module } from '@nestjs/common';
import { InvoicesService } from './service/invoices.service';
import { InvoicesController } from './controller/invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './service/cost-calculation.service';
import { InvoicesChecksService } from './service/invoices-checks.service';
import { PlansService } from '../../plans/plans.service';
import { ItemTypesService } from '../../service/item-types/item-types.service';
import { ServiceTypesService } from '../../service/service-types/service-types.service';
import { InvoiceItemsService } from '../invoice-items/invoice-items.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { InvoicePlansService } from '../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ServiceChecksService } from '../../service/service-instances/services/service-checks/service-checks.service';
import { ConfigsService } from '../../service/configs/configs.service';
import { SessionsService } from '../../sessions/sessions.service';
import { DiscountsService } from '../../service/discounts/discounts.service';
import { ServiceInstancesService } from '../../service/service-instances/service-instances.service';
import { UserService } from '../../user/user/user.service';
import { OrganizationService } from '../../organization/organization.service';
import { PlansModule } from '../../plans/plans.module';
import { InvoiceDiscountsModule } from '../invoice-discounts/invoice-discounts.module';
import { InvoiceItemsModule } from '../invoice-items/invoice-items.module';
import { InvoicePlansModule } from '../invoice-plans/invoice-plans.module';
import { InvoicePropertiesModule } from '../invoice-properties/invoice-properties.module';
import { ItemTypesModule } from '../../service/item-types/item-types.module';
import { ServiceTypesModule } from '../../service/service-types/service-types.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { TransactionsModule } from '../../transactions/transactions.module';
import { ServiceInstancesModule } from '../../service/service-instances/service-instances.module';
import { ServiceItemsSumModule } from '../../service/service-items-sum/service-items-sum.module';


@Module({
  imports: [
    DatabaseModule,
    InvoiceDiscountsModule,
    InvoiceItemsModule,
    InvoicePlansModule,
    InvoicePropertiesModule,
    PlansModule,
    ItemTypesModule,
    ServiceTypesModule,
    TransactionsModule,
    VgpuModule,
    ServiceTypesModule,
    ServiceItemsSumModule,
  ],
  providers: [
    InvoicesService,
    InvoicesChecksService,
    CostCalculationService
  ],
  controllers: [InvoicesController],
  exports: [InvoicesService]
})
export class InvoicesModule {}
