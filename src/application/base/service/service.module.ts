import { forwardRef, Module } from '@nestjs/common';
import { ServiceService } from './services/service.service';
import { CrudModule } from '../crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';
import { CreateServiceService } from './services/create-service.service';
import { ExtendServiceService } from './services/extend-service.service';
import { DiscountsService } from './services/discounts.service';
import { ServiceChecksService } from './services/service-checks.service';
import { UserModule } from '../user/user.module';
import { InvoicesModule } from '../invoice/invoices.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { TasksModule } from '../tasks/tasks.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { ServiceController } from './controller/service.controller';
import { DeleteServiceService } from './services/delete-service.service';
import { ServiceAdminController } from './controller/service-admin.controller';
import { ServiceAdminService } from './services/service-admin.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { ServicePropertiesModule } from '../service-properties/service-properties.module';
import { AbilityModule } from '../security/ability/ability.module';
import { VdcModule } from '../../vdc/vdc.module';
import { DatacenterModule } from '../datacenter/datacenter.module';
import { SystemSettingsTableModule } from '../crud/system-settings-table/system-settings-table.module';
import { ServiceServiceFactory } from './Factory/service.service.factory';
import { ServiceInstancesTableModule } from '../crud/service-instances-table/service-instances-table.module';
import { ServiceItemsTableModule } from '../crud/service-items-table/service-items-table.module';
import { TaskManagerModule } from '../task-manager/task-manager.module';
import { EdgeGatewayModule } from '../../edge-gateway/edge-gateway.module';
import { UvdeskWrapperModule } from 'src/wrappers/uvdesk-wrapper/uvdesk-wrapper.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { PaygServiceService } from './services/payg-service.service';
import { BudgetingModule } from '../budgeting/budgeting.module';
import { VmModule } from '../../vm/vm.module';

@Module({
  imports: [
    CrudModule,
    DatabaseModule,
    SessionsModule,
    LoggerModule,
    UserModule,
    UvdeskWrapperModule,
    PaymentModule,
    MainWrapperModule,
    BudgetingModule,
    forwardRef(() => InvoicesModule),
    // forwardRef(() => TasksModule),
    // forwardRef(() => TasksModule),
    forwardRef(() => VdcModule),
    forwardRef(() => VgpuModule),
    // InvoicesModule,
    // VdcModule,

    forwardRef(() => TasksModule),
    // VgpuModule,
    AbilityModule,
    ServicePropertiesModule,
    TransactionsModule,
    forwardRef(() => DatacenterModule),
    SystemSettingsTableModule,
    ServiceItemsTableModule,
    ServiceInstancesTableModule,
    TaskManagerModule,
    EdgeGatewayModule,
    VmModule,
  ],
  providers: [
    ServiceService,
    CreateServiceService,
    ExtendServiceService,
    DiscountsService,
    ServiceChecksService,
    DeleteServiceService,
    ServiceAdminService,
    ServiceServiceFactory,
    PaygServiceService,
  ],
  controllers: [ServiceController, ServiceAdminController],
  exports: [
    ServiceService,
    CreateServiceService,
    ExtendServiceService,
    DiscountsService,
    ServiceChecksService,
    PaygServiceService,
  ],
})
export class ServiceModule {}
