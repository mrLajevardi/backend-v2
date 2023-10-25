import { Injectable } from '@nestjs/common';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';
import { BaseTask } from '../../interface/base-task.interface';
import { Job } from 'bullmq';
import { TasksEnum } from '../../enum/tasks.enum';
import { TaskDataType } from '../../interface/task-data-type.interface';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { InvoiceFactoryService } from 'src/application/base/invoice/service/invoice-factory.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { ServiceTypesEnum } from 'src/application/base/service/enum/service-types.enum';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { AllocationModel } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/update-vdc-compute-policy.dto';
import { TaskQueryTypes } from 'src/application/base/tasks/enum/task-query-types.enum';

@Injectable()
export class UpgradeVdcComputeResourcesService
  implements BaseTask<UpgradeVdcStepsEnum>
{
  stepName: UpgradeVdcStepsEnum;
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly sessionService: SessionsService,
    private readonly serviceProperties: ServicePropertiesService,
    private readonly configsService: ConfigsTableService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
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
      data: { serviceInstanceId },
    } = job;
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        serviceInstanceId,
      },
    });
    const groupedItems = await this.invoiceFactoryService.groupVdcItems(
      this.vdcFactoryService.transformItems(serviceItems),
    );
    const props =
      await this.serviceProperties.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );
    const adminSession = await this.sessionService.checkAdminSession();
    const networkQuota = await this.configsService.findOne({
      where: {
        propertyKey: 'networkQuota',
        serviceTypeId: ServiceTypesEnum.Vdc,
      },
    });
    const providerVdcReferenceHref =
      process.env.VCLOUD_BASE_URL +
      '/api/admin/providervdc/' +
      props.genId.split(':').slice(-1)[0];
    const { __vcloudTask } = await this.adminVdcWrapperService.updateVdc(
      {
        cores: Number(groupedItems.generation.cpu[0].value),
        ram: Number(groupedItems.generation.ram[0].value),
        name: props.name,
        authToken: adminSession,
        vm: Number(groupedItems.generation.vm[0].value),
        networkQuota: Number(networkQuota.value),
        nicQuota: 0,
        providerVdcReference: {
          href: providerVdcReferenceHref,
        },
        resourceGuaranteedMemory: Number(groupedItems.memoryReservation.value),
        resourceGuaranteedCpu: Number(groupedItems.cpuReservation.value),
        allocationModel: AllocationModel.FLEX,
      },
      props.vdcId,
    );
    const checkTaskFilter = `href==${__vcloudTask}`;
    await this.vdcFactoryService.checkVdcTask(
      adminSession,
      checkTaskFilter,
      TaskQueryTypes.Task,
      1500,
      'increaseComputeResourcesTask',
    );
  }
}
