import { Injectable } from '@nestjs/common';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';
import { BaseTask } from '../../interface/base-task.interface';
import { Job } from 'bullmq';
import { TasksEnum } from '../../enum/tasks.enum';
import { TaskDataType } from '../../interface/task-data-type.interface';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { InvoiceFactoryService } from 'src/application/base/invoice/service/invoice-factory.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';

@Injectable()
export class UpgradeVdcService implements BaseTask<UpgradeVdcStepsEnum> {
  stepName: UpgradeVdcStepsEnum;
  constructor(
    private readonly tasksTableService: TasksTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
  ) {
    this.stepName = UpgradeVdcStepsEnum.UpgradeComputeResources;
  }
  execute(job: Job<TaskDataType, any, TasksEnum>): Promise<void> {
    return this.increaseComputeResources(job);
  }

  async increaseComputeResources(
    job: Job<TaskDataType, any, TasksEnum>,
  ): Promise<void> {
    const {
      data: { serviceInstanceId, taskId },
    } = job;
    const task = await this.tasksTableService.findById(taskId);
    const { userId } = task;
    const loggerOptions = {
      userId,
      serviceInstanceId,
    };
    const args = JSON.parse(task.arguments);
    const targetItems = await this.serviceItemsTableService.find({
      where: {
        serv,
      },
    });
    const targetItemIds = targetItems.map((item) => {
      return item.id;
    });
    const invoiceItems = await app.models.InvoiceItems.find({
      where: {
        and: [
          { ItemID: { inq: targetItemIds } },
          { InvoiceID: args.invoiceId },
        ],
      },
    });
    console.log({ invoiceItems });
    if (invoiceItems.length === 0) {
      return;
    }
    const serviceItems = await app.models.ServiceItems.find({
      where: {
        and: [
          { ItemTypeCode: { inq: ['vm', 'cpuCores', 'ram'] } },
          { ServiceInstanceID: serviceInstanceId },
        ],
      },
    });
    console.log({ serviceItems });
    const serviceItemsKeys = {};
    for (const serviceItem of serviceItems) {
      serviceItemsKeys[serviceItem.ItemTypeCode] = serviceItem;
    }
    const createSession = new CheckSession(app, null);
    const adminSession = await createSession.checkAdminSession();
    const props = await getAllServiceProperties(
      job.data.serviceInstanceId,
      app,
    );
    const networkQuota = await app.models.Configs.findOne({
      where: {
        and: [{ PropertyKey: 'networkQuota' }, { ServiceTypeID: 'vdc' }],
      },
    });
    const { __vcloudTask } = await mainWrapper.admin.vdc.updateVdc(
      {
        cores: serviceItemsKeys.cpuCores.Quantity,
        ram: serviceItemsKeys.ram.Quantity,
        name: props.name,
        authToken: adminSession,
        vm: serviceItemsKeys.vm.Quantity,
        networkQuota: networkQuota.Value,
        nicQuota: vcdConfig.admin.vdc.nicQuota,
        providerVdcReference: vcdConfig.admin.vdc.ProviderVdcReference,
        ResourceGuaranteedMemory: vcdConfig.admin.vdc.ResourceGuaranteedMemory,
        ResourceGuaranteedCpu: vcdConfig.admin.vdc.ResourceGuaranteedCpu,
      },
      props.vdcId,
    );
    console.log(__vcloudTask, '😴');
    const checkTaskFilter = `href==${__vcloudTask}`;
    await checkVdcTask(
      adminSession,
      checkTaskFilter,
      'task',
      1500,
      'increaseComputeResourcesTask',
    );
    await logger.info(
      'vdc',
      'increaseComputeResources',
      {
        _object: loggerOptions.serviceInstanceId,
      },
      loggerOptions,
    );
  }
}
