import { Module } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { TasksController } from './controller/tasks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bull';
import { TaskManagerService } from './service/task-manager.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ServiceInstancesModule } from '../service/service-instances/service-instances.module';
import { ServicePropertiesModule } from '../service/service-properties/service-properties.module';
import { ServiceItemsModule } from '../service/service-items/service-items.module';
import { ConfigsModule } from '../service/configs/configs.module';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user/user.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'tasks',
    }),
    SessionsModule,
    ServiceInstancesModule,
    ServicePropertiesModule,
    ServiceItemsModule,
    ConfigsModule,
    OrganizationModule,
    UserModule,
    VdcModule,
  ],
  providers: [
    TasksService,
    TaskManagerService,
    EdgeService,
    OrgService,
    NetworkService,
    VdcService,
  ],
  controllers: [TasksController],
  exports: [TasksService, TaskManagerService],
})
export class TasksModule {}
