import { Injectable } from '@nestjs/common';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';
import { BaseTask } from '../../interface/base-task.interface';
import { Job } from 'bullmq';
import { TasksEnum } from '../../enum/tasks.enum';
import { InvoiceFactoryService } from 'src/application/base/invoice/service/invoice-factory.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { TaskDataType } from '../../interface/task-data-type.interface';
@Injectable()
export class UpgradeDiskResourcesService
  implements BaseTask<UpgradeVdcStepsEnum>
{
  stepName: UpgradeVdcStepsEnum;
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly sessionService: SessionsService,
    private readonly serviceProperties: ServicePropertiesService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
  ) {
    this.stepName = UpgradeVdcStepsEnum.UpgradeDiskResources;
  }
  execute(job: Job<TaskDataType, any, TasksEnum>): Promise<void> {
    return this.increaseStorageResource(job);
  }

  async increaseStorageResource(
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
    const storagePolicies = await this.vdcFactoryService.getStorageProfiles(
      adminSession,
      groupedItems.generation.disk,
      props.genId.split(':').slice(-1)[0],
    );
    const promises = storagePolicies.map((storagePolicy) => {
      return this.adminVdcWrapperService.updateVdcStorageProfile(
        {
          name: storagePolicy.providerVdcStorageProfile.name,
          units: storagePolicy.units,
          default: storagePolicy.default,
          providerVdcStorageProfile: storagePolicy.providerVdcStorageProfile,
          authToken: adminSession,
          storage: storagePolicy.limit,
          enabled: storagePolicy.enabled,
        },
        props.vdcId,
      );
    });
    await Promise.all(promises);
  }
}
