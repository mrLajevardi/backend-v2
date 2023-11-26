import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerService } from './task-manager.service';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { SessionsModule } from '../../sessions/sessions.module';
import { forwardRef } from '@nestjs/common';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OrganizationModule } from '../../organization/organization.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { ServicePropertiesModule } from '../../service-properties/service-properties.module';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { ServiceModule } from '../../service/service.module';
import { InvoicesModule } from '../../invoice/invoices.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { EdgeGatewayModule } from 'src/application/edge-gateway/edge-gateway.module';
import { NatModule } from 'src/application/nat/nat.module';
import { NetworksModule } from 'src/application/networks/networks.module';
import { TaskManagerModule } from '../../task-manager/task-manager.module';
import { UvdeskWrapperModule } from 'src/wrappers/uvdesk-wrapper/uvdesk-wrapper.module';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

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
        ServicePropertiesModule,
        ServiceModule,
        InvoicesModule,
        VdcModule,
        MainWrapperModule,
        EdgeGatewayModule,
        NatModule,
        NetworksModule,
        TaskManagerModule,
      ],
      providers: [
        TaskManagerService,
        TasksService,
        VgpuDnatService,
        ServicePropertiesService,
      ],
    }).compile();

    service = module.get<TaskManagerService>(TaskManagerService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
