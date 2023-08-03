import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bull';
import { TaskManagerService } from './service/task-manager.service';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { CrudModule } from '../crud/crud.module';
import { SessionsModule } from '../sessions/sessions.module';
import { OrganizationModule } from '../organization/organization.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';
import { TasksController } from './controller/tasks.controller';
import { ServiceModule } from '../service/service.module';
import { NetworksModule } from 'src/application/networks/networks.module';
import { ServicePropertiesModule } from '../service-properties/service-properties.module';

@Module({
  imports: [
    DatabaseModule,
    VdcModule,
    BullModule.registerQueue({
      name: 'tasks',
    }),
    LoggerModule,
    // VdcModule,
    forwardRef(() => VgpuModule),
    CrudModule,
    SessionsModule,
    OrganizationModule,
    VdcModule,
    NetworksModule,
    ServicePropertiesModule
  ],
  providers: [
    TasksService,
    TaskManagerService,   
  ],
  controllers: [TasksController],
  exports: [TasksService, TaskManagerService],
})
export class TasksModule {}
