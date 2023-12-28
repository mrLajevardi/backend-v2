import { Test, TestingModule } from '@nestjs/testing';
import { RobotController } from './robot.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { RobotService } from '../service/robot.service';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { PayAsYouGoModule } from 'src/application/base/pay-as-you-go/pay-as-you-go.module';
import { ServicePropertiesModule } from 'src/application/base/service-properties/service-properties.module';
import { SessionsModule } from 'src/application/base/sessions/sessions.module';
import { TasksModule } from 'src/application/base/tasks/tasks.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CheckServiceService } from '../service/check-service.service';
import { PaygInvoiceService } from '../service/payg-invoice.service';
import { VgpuPayAsYouGoService } from '../service/vgpu-pay-as-you-go.service';
import { PaygRobotService } from '../service/payg-robot.service';
import { ServiceModule } from 'src/application/base/service/service.module';

describe('RobotController', () => {
  let controller: RobotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        NotificationModule,
        TasksModule,
        ServicePropertiesModule,
        SessionsModule,
        LoggerModule,
        PayAsYouGoModule,
        ServiceModule,
      ],
      controllers: [RobotController],
      providers: [
        RobotService,
        CheckServiceService,
        PaygInvoiceService,
        VgpuPayAsYouGoService,
        PaygRobotService,
      ],
    }).compile();

    controller = module.get<RobotController>(RobotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
