import { Module, forwardRef } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { taskFactory } from './taskFactory';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { FlowProducers, QueueNames } from './enum/queue-names.enum';
import { UpgradeVdcService } from './tasks/upgradeVdc/upgrade-vdc.service';
import { IncreaseNumberOfIpsService } from './tasks/upgradeVdc/increase-number-of-ips.service';
import { UpgradeVdcComputeResourcesService } from './tasks/upgradeVdc/upgrade-compute-resources.service';
import { UpgradeDiskResourcesService } from './tasks/upgradeVdc/upgrade-disk-resource.service';
import { InvoicesModule } from '../invoice/invoices.module';
import { VdcModule } from 'src/application/vdc/vdc.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ServicePropertiesModule } from '../service-properties/service-properties.module';
import { MainWrapperModule } from 'src/wrappers/main-wrapper/main-wrapper.module';
import { TaskManagerEventListenerService } from './service/task-manager-event-listener.service';
import { UvdeskWrapperModule } from 'src/wrappers/uvdesk-wrapper/uvdesk-wrapper.module';
import { DatacenterModule } from '../datacenter/datacenter.module';
@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.NewTaskManager,
    }),
    BullModule.registerFlowProducer({
      name: FlowProducers.NewTaskManagerFlow,
    }),
    DatabaseModule,
    CrudModule,
    forwardRef(() => InvoicesModule),
    forwardRef(() => VdcModule),
    SessionsModule,
    ServicePropertiesModule,
    MainWrapperModule,
    UvdeskWrapperModule,
    DatacenterModule,
  ],
  providers: [
    TaskManagerEventListenerService,
    TaskManagerService,
    UpgradeVdcService,
    {
      provide: 'TASK_MANAGER_TASKS',
      useFactory: taskFactory,
      inject: [UpgradeVdcService],
    },
    IncreaseNumberOfIpsService,
    UpgradeVdcComputeResourcesService,
    UpgradeDiskResourcesService,
  ],
  exports: [TaskManagerService],
})
export class TaskManagerModule {}
