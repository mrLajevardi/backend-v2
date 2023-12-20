import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bull';
import { TaskManagerService } from './service/task-manager.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { CrudModule } from '../crud/crud.module';
import { SessionsModule } from '../sessions/sessions.module';
import { OrganizationModule } from '../organization/organization.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { TasksController } from './controller/tasks.controller';
import { ServicePropertiesModule } from '../service-properties/service-properties.module';
import { VgpuDnatService } from 'src/application/vgpu/vgpu-dnat.service';
import { PayAsYouGoModule } from '../pay-as-you-go/pay-as-you-go.module';
import { TaskAdminController } from './controller/task-admin.controller';
import { TaskAdminService } from './service/task-admin.service';
import { AbilityModule } from '../security/ability/ability.module';
import { InvoicesModule } from '../invoice/invoices.module';
import { UserModule } from '../user/user.module';
import { TaskManagerModule } from '../task-manager/task-manager.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { EdgeGatewayModule } from 'src/application/edge-gateway/edge-gateway.module';
import { NatModule } from 'src/application/nat/nat.module';
import { NetworksModule } from 'src/application/networks/networks.module';
import { VmModule } from '../../vm/vm.module';
import { TaskFactoryService } from './service/task.factory.service';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'tasks2',
    }),
    LoggerModule,
    TaskManagerModule,
    MainWrapperModule,
    EdgeGatewayModule,
    NatModule,
    forwardRef(() => NetworksModule),
    // VdcModule,
    forwardRef(() => VdcModule),
    forwardRef(() => InvoicesModule),
    CrudModule,
    SessionsModule,
    forwardRef(() => OrganizationModule),
    AbilityModule,
    PayAsYouGoModule,
    //NetworksModule,
    ServicePropertiesModule,
    VmModule,
  ],
  providers: [
    TasksService,
    TaskManagerService,
    VgpuDnatService,
    NetworkService,
    TaskAdminService,
    TaskFactoryService,
  ],
  controllers: [TasksController, TaskAdminController],
  exports: [TasksService, TaskManagerService],
})
export class TasksModule {}
