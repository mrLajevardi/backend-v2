import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { TicketingWrapperService } from 'src/wrappers/uvdesk-wrapper/service/wrapper/ticketing-wrapper.service';
import { ServiceStatusEnum } from 'src/application/base/service/enum/service-status.enum';
import { ActAsTypeEnum } from 'src/wrappers/uvdesk-wrapper/service/wrapper/enum/act-as-type.enum';
import { TicketsMessagesEnum } from 'src/application/base/ticket/enum/tickets-message.enum';
import { TicketsSubjectEnum } from 'src/application/base/ticket/enum/tickets-subject.enum';
import {
  BASE_VDC_DETAIL_SERVICE,
  BaseVdcDetailService,
} from 'src/application/vdc/interface/service/base-vdc-detail-service.interface';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { GetAllVdcServiceWithItemsResultDto } from 'src/application/base/service/dto/get-all-vdc-service-with-items-result.dto';
import { VdcDetailService } from 'src/application/vdc/service/vdc-detail.service';
import { VdcStorageProfileParams } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/create-vdc.dto';
import { AddVdcStoragePolicyDto } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/add-vdc-storage-policy.dto';
import { TaskQueryTypes } from 'src/application/base/tasks/enum/task-query-types.enum';
import { TicketService } from '../../../ticket/ticket.service';
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
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly userService: UserTableService,
    private readonly ticketingWrapperService: TicketingWrapperService,
    private readonly ticketService: TicketService,
    @Inject(forwardRef(() => VdcDetailService))
    private readonly vdcDetailService: VdcDetailService,
  ) {
    this.stepName = UpgradeVdcStepsEnum.UpgradeDiskResources;
  }
  async execute(job: Job<TaskDataType, any, TasksEnum>): Promise<void> {
    try {
      await this.increaseStorageResource(job);
    } catch (err) {
      const service = await this.serviceInstanceTableService.findById(
        job.data.serviceInstanceId,
      );
      const user = await this.userService.findById(service.userId);
      const options: SessionRequest = {
        user: {
          userId: user.id,
        },
      } as SessionRequest;
      console.log(err);
      await this.ticketService.createTicket(options, {
        message: TicketsMessagesEnum.IncreaseStorageResourceFailure,
        name: user.name,
        serviceInstanceId: job.data.serviceInstanceId,
        subject: TicketsSubjectEnum.AutomaticTicket,
      });
      return Promise.reject(err);
    }
  }

  async increaseStorageResource(
    job: Job<TaskDataType, any, TasksEnum>,
  ): Promise<void> {
    const {
      data: { serviceInstanceId },
    } = job;
    const service = await this.serviceInstanceTableService.findById(
      serviceInstanceId,
    );
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
    const options: SessionRequest = {
      user: {
        userId: service.userId,
      },
    } as SessionRequest;
    const vdcStoragePolicies = await this.vdcDetailService.getVdcItemLimit(
      serviceInstanceId,
      options,
    );
    const updateList: VdcStorageProfileParams[] = [];
    const addList: AddVdcStoragePolicyDto[] = [];
    storagePolicies.forEach((value) => {
      const policy = vdcStoragePolicies.diskInfo.find(
        (item) => item.name === value.providerVdcStorageProfile.name,
      );
      if (policy) {
        updateList.push(value);
      } else {
        addList.push({
          ...value,
          name: value.providerVdcStorageProfile.name,
        });
      }
    });
    const promises = updateList.map((storagePolicy) => {
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
    if (addList.length === 0) {
      return;
    }
    const { __vcloudTask } =
      await this.adminVdcWrapperService.addVdcStorageProfile(
        addList,
        props.vdcId,
        adminSession,
      );
    const checkTaskFilter = `href==${__vcloudTask}`;
    await this.vdcFactoryService.checkVdcTask(
      adminSession,
      checkTaskFilter,
      TaskQueryTypes.AdminTask,
      1500,
      this.stepName,
    );
  }
}
