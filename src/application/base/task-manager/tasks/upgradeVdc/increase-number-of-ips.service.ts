import { Injectable } from '@nestjs/common';
import { BaseTask } from '../../interface/base-task.interface';
import { UpgradeVdcStepsEnum } from './enum/upgrade-vdc-steps.enum';
import { Job } from 'bullmq';
import { TaskDataType } from '../../interface/task-data-type.interface';
import { TasksEnum } from '../../enum/tasks.enum';
import { InvoiceFactoryService } from 'src/application/base/invoice/service/invoice-factory.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { VdcFactoryService } from 'src/application/vdc/service/vdc.factory.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { VdcServiceProperties } from 'src/application/vdc/enum/vdc-service-properties.enum';
import { ServiceProperties } from 'src/infrastructure/database/entities/ServiceProperties';
import { IpRangeObject } from './interface/ip-range-object.interface';
import { TaskQueryTypes } from 'src/application/base/tasks/enum/task-query-types.enum';
import { AdminEdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import { EdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceStatusEnum } from 'src/application/base/service/enum/service-status.enum';
import { TicketingWrapperService } from 'src/wrappers/uvdesk-wrapper/service/wrapper/ticketing-wrapper.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { ActAsTypeEnum } from 'src/wrappers/uvdesk-wrapper/service/wrapper/enum/act-as-type.enum';
import { TicketsMessagesEnum } from 'src/application/base/ticket/enum/tickets-message.enum';
import { TicketsSubjectEnum } from 'src/application/base/ticket/enum/tickets-subject.enum';

@Injectable()
export class IncreaseNumberOfIpsService
  implements BaseTask<UpgradeVdcStepsEnum>
{
  stepName: UpgradeVdcStepsEnum;
  constructor(
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly sessionService: SessionsService,
    private readonly serviceProperties: ServicePropertiesService,
    private readonly servicePropertiesTableService: ServicePropertiesTableService,
    private readonly adminEdgeGatewayWrapperService: AdminEdgeGatewayWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly tasksTableService: TasksTableService,
    private readonly ticketingWrapperService: TicketingWrapperService,
    private readonly userService: UserTableService,
  ) {
    this.stepName = UpgradeVdcStepsEnum.IncreaseNumberOfIps;
  }

  async execute(job: Job<TaskDataType, any, TasksEnum>): Promise<void> {
    try {
      await this.increaseNumberOfIps(job);
    } catch (err) {
      const service = await this.serviceInstanceTableService.findById(
        job.data.serviceInstanceId,
      );
      const user = await this.userService.findById(service.userId);
      await this.ticketingWrapperService.createTicket(
        TicketsMessagesEnum.IncreaseNumberOfIpsFailure,
        ActAsTypeEnum.User,
        null,
        user.name,
        TicketsSubjectEnum.AutomaticTicket,
        user.username,
      );
      console.log(err);
      return Promise.reject(err);
    }
  }

  async increaseNumberOfIps(
    job: Job<TaskDataType, any, TasksEnum>,
  ): Promise<void> {
    const {
      data: { serviceInstanceId, taskId },
    } = job;
    const task = await this.tasksTableService.findById(taskId);
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
    const userSession = await this.sessionService.checkUserSession(
      task.userId,
      Number(props.orgId),
    );
    const adminSession = await this.sessionService.checkAdminSession();
    const filter = `name==${props.edgeName}`;
    const currentGateway = await this.edgeGatewayWrapperService.getEdgeGateway(
      userSession,
      1,
      1,
      filter,
    );
    const result = currentGateway.values[0];
    const edgeId = result.id;
    console.dir(result, { depth: null });
    const primaryIp = result.edgeGatewayUplinks[0].subnets.values[0].primaryIp;
    const assignedIps = await this.servicePropertiesTableService.find({
      where: {
        serviceInstanceId,
        propertyKey: VdcServiceProperties.IpRange,
      },
    });

    const assignedIpList = this.convertIpRangeToIpObject(assignedIps);
    if (Number(groupedItems.generation.ip[0].value) === assignedIpList.length) {
      return;
    }
    const response = await this.adminEdgeGatewayWrapperService.updateEdge(
      {
        name: props.edgeName,
        authToken: adminSession,
        alreadyAssignedIpCounts: assignedIps.length,
        alreadyAssignedIpList: assignedIpList,
        userIpCount:
          Number(groupedItems.generation.ip[0].value) - assignedIpList.length,
        vdcId: props.vdcId,
      },
      edgeId,
      primaryIp,
    );
    const { __vcloudTask, ipRange: newIpRange } = response;
    const checkTaskFilter = `href==${__vcloudTask}`;
    await this.vdcFactoryService.checkVdcTask(
      adminSession,
      checkTaskFilter,
      TaskQueryTypes.AdminTask,
      1500,
      'increaseIpTask',
    );
    for (const ip of newIpRange) {
      await this.servicePropertiesTableService.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: VdcServiceProperties.IpRange,
        value: `${ip.startAddress}-${ip.endAddress}`,
      });
    }
  }

  convertIpRangeToIpObject(IpRangeProps: ServiceProperties[]): IpRangeObject[] {
    const ipRangeObject = IpRangeProps.map((ip) => {
      const splittedIpRange = ip.value.split('-');
      return {
        startAddress: splittedIpRange[0],
        endAddress: splittedIpRange[1],
      };
    });
    return ipRangeObject;
  }
}
