import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    CrudModule,
    DatabaseModule,
    SessionsModule,
    LoggerModule,
    UserModule,
    PaymentModule,
    InvoicesModule,
    VdcModule,
    TasksModule,
    VgpuModule,
    AbilityModule,
    ServicePropertiesModule,
    TransactionsModule,
    DatacenterModule,
    SystemSettingsTableModule,
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
  ],
  controllers: [ServiceController, ServiceAdminController],
  exports: [
    ServiceService,
    CreateServiceService,
    ExtendServiceService,
    DiscountsService,
    ServiceChecksService,
  ],
})
export class ServiceModule {}
