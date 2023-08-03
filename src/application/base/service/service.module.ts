import { Module, forwardRef } from '@nestjs/common';
import { ServiceService } from './services/service.service';
import { PayAsYouGoService } from './services/pay-as-you-go.service';
import { CrudModule } from '../crud/crud.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SessionsModule } from '../sessions/sessions.module';
import { CreateServiceService } from './services/create-service.service';
import { ExtendServiceService } from './services/extend-service.service';
import { DiscountsService } from './services/discounts.service';
import { ServiceChecksService } from './services/service-checks/service-checks.service';
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

@Module({
  imports: [
    CrudModule,
    DatabaseModule,
    SessionsModule,
    LoggerModule,
    UserModule,
    forwardRef(() => InvoicesModule),
    forwardRef(() => VgpuModule),
    forwardRef(() => TasksModule),
    TransactionsModule,
  ],
  providers: [
    ServiceService,
    PayAsYouGoService,
    CreateServiceService,
    ExtendServiceService,
    DiscountsService,
    ServiceChecksService,
    DeleteServiceService,
    ServiceAdminService,
  ],
  controllers: [ServiceController, ServiceAdminController],
  exports: [
    ServiceService,
    PayAsYouGoService,
    CreateServiceService,
    ExtendServiceService,
    DiscountsService,
    ServiceChecksService,
  ],
})
export class ServiceModule {}
