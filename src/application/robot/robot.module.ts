import { Module } from '@nestjs/common';
import { RobotService } from './service/robot.service';
import { RobotController } from './controller/robot.controller';
import { CheckServiceService } from './service/check-service.service';
import { PaygInvoiceService } from './service/payg-invoice.service';
import { VgpuPayAsYouGoService } from './service/vgpu-pay-as-you-go.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../base/crud/crud.module';
import { NotificationModule } from '../base/notification/notification.module';
import { TasksModule } from '../base/tasks/tasks.module';
import { ServicePropertiesModule } from '../base/service-properties/service-properties.module';
import { SessionsModule } from '../base/sessions/sessions.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PayAsYouGoModule } from '../base/pay-as-you-go/pay-as-you-go.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    NotificationModule,
    TasksModule,
    ServicePropertiesModule,
    SessionsModule,
    LoggerModule,
    PayAsYouGoModule,
  ],
  providers: [
    RobotService,
    CheckServiceService,
    PaygInvoiceService,
    VgpuPayAsYouGoService,
  ],
  controllers: [RobotController],
})
export class RobotModule {}
