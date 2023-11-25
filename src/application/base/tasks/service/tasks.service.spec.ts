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
import { ServiceServiceFactory } from '../../service/Factory/service.service.factory';
import { DatacenterModule } from '../../datacenter/datacenter.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { UserModule } from '../../user/user.module';
import { EdgeGatewayModule } from '../../../edge-gateway/edge-gateway.module';
import { UvdeskWrapperModule } from 'src/wrappers/uvdesk-wrapper/uvdesk-wrapper.module';

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
        InvoicesModule,
        // VdcModule,
        forwardRef(() => VgpuModule),
        CrudModule,
        SessionsModule,
        OrganizationModule,
        ServiceModule,
        PaymentModule,
        ServicePropertiesModule,
        VdcModule,
        DatacenterModule,
        UserModule,
        EdgeGatewayModule,
        // UvdeskWrapperModule,
      ],
      providers: [
        TaskManagerService,
        TasksService,
        ServiceService,
        VgpuDnatService,
        ServiceServiceFactory,
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
