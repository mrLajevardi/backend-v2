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
import { PayAsYouGoService } from '../services/pay-as-you-go.service';
import { ServiceChecksService } from '../services/service-checks/service-checks.service';
import { ServiceService } from '../services/service.service';

describe('ServiceController', () => {
  let controller: ServiceController;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CrudModule,
        DatabaseModule,
        SessionsModule,
        UserModule,
        BullModule.registerQueue({
          name: 'tasks',
        }),
        LoggerModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        TransactionsModule,
        VdcModule,
      ],
      providers: [
        ServiceService,
        PayAsYouGoService,
        CreateServiceService,
        ExtendServiceService,
        DiscountsService,
        ServiceChecksService,
        DeleteServiceService,
        TaskManagerService,
        TasksService,
        NetworkService
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
