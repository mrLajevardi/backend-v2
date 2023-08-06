import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DeleteServiceService } from '../services/delete-service.service';
import { CreateServiceService } from '../services/create-service.service';
import { CrudModule } from '../../crud/crud.module';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrganizationModule } from '../../organization/organization.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserModule } from '../../user/user.module';
import { DiscountsService } from '../services/discounts.service';
import { ExtendServiceService } from '../services/extend-service.service';
import { PayAsYouGoService } from '../../pay-as-you-go/pay-as-you-go.service';
import { ServiceChecksService } from '../services/service-checks/service-checks.service';
import { ServiceService } from '../services/service.service';
import { PaymentModule } from 'src/application/payment/payment.module';
import { TasksModule } from '../../tasks/tasks.module';
import { ServiceAdminService } from '../services/service-admin.service';
import { UserService } from '../../user/service/user.service';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { AbilityModule } from '../../security/ability/ability.module';

describe('ServiceController', () => {
  let controller: ServiceController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        SessionsModule,
        TasksModule,
        LoggerModule,
        PaymentModule,
        VgpuModule,
        UserModule,
        ServicePropertiesModule,
      ],
      providers: [
        ServiceAdminService,
        ServiceService,
        ExtendServiceService,
        DeleteServiceService,
        CreateServiceService,
      ],
      controllers: [ServiceController],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
