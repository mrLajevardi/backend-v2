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

@Injectable()
export class IncreaseNumberOfIps implements BaseTask<UpgradeVdcStepsEnum> {
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
    private readonly tasksTableService: TasksTableService,
  ) {
    this.stepName = UpgradeVdcStepsEnum.IncreaseNumberOfIps;
  }

  execute(job: Job<TaskDataType, any, TasksEnum>): Promise<void> {
    return this.increaseNumberOfIps(job);
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
      props.orgId,
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
    const { __vcloudTask, ipRange: newIpRange } =
      await this.adminEdgeGatewayWrapperService.updateEdge(
        {
          name: props.edgeName,
          authToken: adminSession,
          alreadyAssignedIpCounts: assignedIps.length,
          alreadyAssignedIpList: assignedIpList,
          userIpCount: Number(groupedItems.generation.ip[0]),
          vdcId: props.vdcId,
        },
        edgeId,
        primaryIp,
      );
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
