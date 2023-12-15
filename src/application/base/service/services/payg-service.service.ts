import { Injectable } from '@nestjs/common';
import { VmWrapperService } from 'src/wrappers/main-wrapper/service/user/vm/vm-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { GetVMQueryDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/get-vm-query.dto';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { GetVdcIdBy } from 'src/application/vdc/utils/vdc-properties.utils';
import { VmPowerStateEventEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';
import { PaygCostCalculationService } from '../../invoice/service/payg-cost-calculation.service';
import { InvoiceItemCost } from '../../invoice/interface/invoice-item-cost.interface';
import { cloneDeep } from 'lodash';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { NatWrapperService } from 'src/wrappers/main-wrapper/service/user/nat/nat-wrapper.service';
import { BudgetingService } from '../../budgeting/service/budgeting.service';
import { AdminEdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { VdcServiceProperties } from 'src/application/vdc/enum/vdc-service-properties.enum';
import { EdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { CreatePaygVdcServiceDto } from '../dto/create-payg-vdc-service.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ExtendServiceService } from './extend-service.service';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService } from '../../tasks/service/task-manager.service';

@Injectable()
export class PaygServiceService {
  constructor(
    private readonly vmWrapperService: VmWrapperService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly organizationTableService: OrganizationTableService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly budgetingService: BudgetingService,
    private readonly adminEdgeGatewayWrapperService: AdminEdgeGatewayWrapperService,
    private readonly servicePropertiesTableService: ServicePropertiesTableService,
    private readonly edgeWrapperService: EdgeGatewayWrapperService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly extendService: ExtendServiceService,
    private readonly itemTypeTableService: ItemTypesTableService,
    private readonly taskTableService: TasksTableService,
    private readonly taskManagerService: TaskManagerService,
  ) {}

  async checkAllVdcVmsEvents(): Promise<void> {
    const adminSession = await this.sessionService.checkAdminSession();
    const activeServices = await this.serviceInstanceTableService.find({
      where: {
        status: ServiceStatusEnum.Success,
        userId: 1043,
        isDeleted: false,
      },
    });
    for (const service of activeServices) {
      const props =
        await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
          service.id,
        );
      const org = await this.organizationTableService.findById(
        Number(props.orgId),
      );
      const tenantHeaders = {
        'X-Vmware-Vcloud-Tenant-Context': org.orgId,
        'X-Vmware-Vcloud-Auth-Context': org.name,
      };
      const vmslist = await this.vdcWrapperService.vcloudQuery<GetVMQueryDto>(
        adminSession,
        {
          type: 'vm',
          page: 1,
          pageSize: 128,
          filter: `(isVAppTemplate==false;vdc==${GetVdcIdBy(props.vdcId)})`,
        },
        tenantHeaders,
      );
      const totalVpcCost: InvoiceItemCost[][] = [];
      for (const vm of vmslist.data.record) {
        const containerId = vm.container.split('/').slice(-1)[0];
        const id = vm.href.split('/').slice(-1)[0];
        const sortAsc = 'timestamp';
        const urnVmId = 'urn:vcloud:vm:' + id.replace('vm-', '');
        const urnContainerId =
          'urn:vcloud:vapp:' + containerId.replace('vapp-', '');
        const offset = service.offset;
        let lastState = service.lastState;
        const eventType = 'com/vmware/vcloud/event/vm/change_state';
        const filter = `(timestamp=gt=${offset};(eventEntity.id==${urnVmId},eventEntity.id==${urnContainerId});eventType==${eventType})`;
        const events = await this.vmWrapperService.eventVm(
          adminSession,
          filter,
          1,
          128,
          tenantHeaders,
          sortAsc,
        );
        let startDate = new Date(offset);
        let endDate: Date;
        let checkCompleted = false;
        for (const event of events.data.values) {
          const vmState = event.additionalProperties['vm.state'];
          if (checkCompleted) {
            continue;
          }
          if (
            lastState === VmPowerStateEventEnum.PowerOff &&
            vmState !== VmPowerStateEventEnum.PowerOff
          ) {
            lastState = vmState;
            startDate = new Date(event.timestamp);
            continue;
          } else if (lastState === VmPowerStateEventEnum.PowerOn) {
            if (vmState !== VmPowerStateEventEnum.PowerOn) {
              endDate = new Date(event.timestamp);
              lastState = vmState;
            } else {
              endDate = new Date();
              checkCompleted = true;
            }
            const computeItems =
              await this.paygCostCalculationService.calculateVdcPaygVm(
                service,
                startDate,
                endDate,
                vm.numberOfCpus,
                vm.memoryMB,
              );
            totalVpcCost.push(computeItems);
            startDate = endDate;
          }
        }
      }
      const sum = this.sumComputeItems(totalVpcCost);
      const totalCost =
        await this.paygCostCalculationService.calculateVdcPaygService(
          sum,
          service,
        );
      try {
        await this.budgetingService.paidFromBudgetCredit(
          service.id,
          {
            paidAmount: totalCost.totalCost,
          },
          totalCost.itemsSum,
        );
      } catch (err) {
        await this.disablePaygService(
          props,
          service.id,
          tenantHeaders,
          adminSession,
          vmslist.data,
        );
      }
    }
  }

  sumComputeItems(invoiceItemsCost: InvoiceItemCost[][]): InvoiceItemCost[] {
    const sum = cloneDeep(invoiceItemsCost[0]);
    sum[0] = { ...sum[0], cost: 0, value: '0' };
    sum[1] = { ...sum[1], cost: 0, value: '0' };
    for (const invoiceItemCost of invoiceItemsCost) {
      sum[0].value = String(
        Number(sum[0].value) + Number(invoiceItemCost[0].value),
      );
      sum[1].value = String(
        Number(sum[1].value) + Number(invoiceItemCost[1].value),
      );
      sum[0].cost = sum[0].cost + invoiceItemCost[0].cost;
      sum[1].cost = sum[1].cost + invoiceItemCost[1].cost;
    }
    return sum;
  }

  async disablePaygService(
    props: VdcProperties,
    serviceInstanceId: string,
    tenantHeaders: object,
    session: string,
    vmList: GetVMQueryDto,
  ): Promise<void> {
    const vmRequests: Promise<VcloudTask>[] = [];
    const action = 'suspend';
    const ips = await this.servicePropertiesTableService.find({
      where: {
        propertyKey: VdcServiceProperties.IpRange,
        serviceInstanceId,
      },
    });
    const alreadyAssignedIpList = ips.map((item) => {
      const ip = item.value.split('-')[0];
      return {
        startAddress: ip,
        endAddress: ip,
      };
    });
    const filter = `name==${props.edgeName}`;
    const currentGateway = await this.edgeWrapperService.getEdgeGateway(
      session,
      1,
      1,
      filter,
    );
    const result = currentGateway.values[0];
    const edgeId = result.id;
    vmList.record.forEach((item) => {
      const vmId = item.href.split('/').slice(-1)[0];
      const promise = this.vmWrapperService.undeployvApp(
        session,
        vmId,
        action,
        tenantHeaders,
      );
      vmRequests.push(promise);
    });
    try {
      await Promise.allSettled(vmRequests);
    } catch (err) {
      console.log(err);
    }
    try {
      await this.adminEdgeGatewayWrapperService.updateEdge(
        {
          alreadyAssignedIpCounts: ips.length,
          alreadyAssignedIpList,
          authToken: session,
          name: props.edgeName,
          userIpCount: 0,
          vdcId: props.vdcId,
          connected: false,
        },
        edgeId,
        result.edgeGatewayUplinks[0].subnets.values[0].primaryIp,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async createPaygVdcService(
    dto: CreatePaygVdcServiceDto,
    options: SessionRequest,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const firstItem = await this.itemTypeTableService.findById(
      dto.itemsTypes[0].itemTypeId,
    );
    const serviceInstanceId = await this.extendService.createServiceInstance(
      userId,
      firstItem.serviceTypeId,
      null,
      null,
      firstItem.datacenterName,
      ServicePlanTypeEnum.Payg,
    );
    for (const item of dto.itemsTypes) {
      await this.serviceItemsTableService.create({
        serviceInstanceId,
        itemTypeId: item.itemTypeId,
        quantity: 0,
        value: item.value,
        itemTypeCode: '',
      });
    }
    const task = await this.taskTableService.create({
      userId: userId,
      serviceInstanceId,
      operation: 'createDataCenter',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      nextTask: 'createOrg',
      requestOptions: {
        ...options.user,
        serviceInstanceId: serviceInstanceId,
      },
      target: 'object',
    });
    return {
      taskId: task.taskId,
    };
  }
}
