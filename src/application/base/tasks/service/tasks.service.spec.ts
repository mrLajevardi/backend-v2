import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TaskManagerService } from './task-manager.service';
import { BullModule } from '@nestjs/bull';
import { forwardRef } from '@nestjs/common';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { OrganizationModule } from '../../organization/organization.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { ServiceService } from '../../service/services/service.service';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { ServiceModule } from '../../service/service.module';
import { PaymentModule } from 'src/application/payment/payment.module';

describe('TasksService', () => {
  let service: TasksService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        BullModule.registerQueue({
          name: 'tasks2',
        }),
        LoggerModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        ServiceModule,
        PaymentModule,
        ServicePropertiesModule,
        VdcModule,
      ],
      providers: [
        TaskManagerService,
        TasksService,
        ServiceService,
        VgpuDnatService,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
