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
import { MainWrapperModule } from '../../../../wrappers/main-wrapper/main-wrapper.module';
import { NetworksModule } from '../../../networks/networks.module';
import { NatModule } from '../../../nat/nat.module';
import { TaskManagerModule } from '../../task-manager/task-manager.module';
import { TaskFactoryService } from './task.factory.service';
import { VmModule } from '../../../vm/vm.module';
import { VServiceInstancesTableModule } from '../../crud/v-service-instances-table/v-service-instances-table.module';
import { ServiceItemModule } from '../../service-item/service-item.module';
import { ServiceInstancesTableModule } from '../../crud/service-instances-table/service-instances-table.module';
import { VServiceInstancesDetailTableModule } from '../../crud/v-service-instances-detail-table/v-service-instances-detail-table.module';
import { VReportsUserModule } from '../../crud/v-reports-user-table/v-reports-user.module';
import { TicketModule } from '../../ticket/ticket.module';

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
        TaskManagerModule,
        MainWrapperModule,
        ServicePropertiesModule,
        EdgeGatewayModule,
        NetworksModule,
        NatModule,
        LoggerModule,
        InvoicesModule,
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
        VmModule,
        VServiceInstancesTableModule,
        ServiceItemModule,
        ServiceInstancesTableModule,
        VServiceInstancesDetailTableModule,
        VReportsUserModule,
        TicketModule,
      ],
      providers: [
        TaskManagerService,
        TaskFactoryService,
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
