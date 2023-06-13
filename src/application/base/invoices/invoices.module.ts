import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CostCalculationService } from './cost-calculation.service';
import { InvoicesChecksService } from './invoices-checks.service';
import { PlansService } from '../plans/plans.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { ServiceTypesService } from '../service-types/service-types.service';
import { InvoiceItemsService } from '../invoice-items/invoice-items.service';
import { TransactionsService } from '../transactions/transactions.service';
import { InvoicePlansService } from '../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../invoice-properties/invoice-properties.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ServiceChecksService } from '../service-instances/service-checks.service';
import { ConfigsService } from '../configs/configs.service';
import { SessionsService } from '../sessions/sessions.service';
import { DiscountsService } from '../discounts/discounts.service';
import { ServiceInstancesService } from '../service-instances/service-instances.service';
import { UserService } from '../user/user.service';
import { OrganizationService } from '../organization/organization.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    InvoicesService,
    CostCalculationService,
    InvoicesChecksService,
    PlansService,
    ItemTypesService,
    ServiceTypesService,
    InvoicesChecksService,
    CostCalculationService,
    InvoiceItemsService,
    TransactionsService,
    InvoicePlansService,
    InvoicePropertiesService,
    VgpuService,
    ServiceChecksService,
    ConfigsService,
    SessionsService,
    DiscountsService,
    ServiceInstancesService,
    UserService,
    OrganizationService,
  ],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
