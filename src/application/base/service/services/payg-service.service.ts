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
import { BudgetingService } from '../../budgeting/service/budgeting.service';
import { AdminEdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { VdcServiceProperties } from 'src/application/vdc/enum/vdc-service-properties.enum';
import { EdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { CreatePaygVdcServiceDto } from '../../invoice/dto/create-payg-vdc-service.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ExtendServiceService } from './extend-service.service';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { UserInfoService } from '../../user/service/user-info.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { VdcGenerationItemCodes } from '../../itemType/enum/item-type-codes.enum';
import {
  IP_SPLITTER,
  ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
} from '../../itemType/const/item-type-code-hierarchy.const';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { SystemSettingsPropertyKeysEnum } from '../../crud/system-settings-table/enum/system-settings-property-keys.enum';
import { transferItems } from '../../invoice/utils/transfer-items.utils';
import { LastVmStates } from '../interface/last-vm-states.interface';
import { In, Not } from 'typeorm';
import { CreateServiceDto } from '../dto/create-service.dto';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { TemplatesTableService } from '../../crud/templates/templates-table.service';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { TemplatesStructure } from 'src/application/vdc/dto/templates.dto';
import { VmStatusEnum } from 'src/application/vm/enums/vm-status.enum';
import { TasksEnum } from '../../task-manager/enum/tasks.enum';
import { TaskManagerService as NewTaskManagerService } from '../../task-manager/service/task-manager.service';

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
    private readonly taskTableService: TasksTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly userInfoService: UserInfoService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly systemSettingsTableService: SystemSettingsTableService,
    private readonly invoiceTableService: InvoicesTableService,
    private readonly invoiceItemsTableService: InvoiceItemsTableService,
    private readonly templateTableService: TemplatesTableService,
    private readonly newTaskManagerService: NewTaskManagerService,
  ) {}

  async checkAllVdcVmsEvents(
    services: ServiceInstances[] = null,
  ): Promise<void> {
    const adminSession = await this.sessionService.checkAdminSession();
    const activeServices =
      services ??
      (await this.serviceInstanceTableService.find({
        where: {
          isDeleted: false,
          status: Not(In([ServiceStatusEnum.Error])),
          servicePlanType: ServicePlanTypeEnum.Payg,
        },
      }));

    for (const service of activeServices) {
      if (service.userId == 2250) {
        console.log(
          ' \n\n\n\n\n\n<debug_payg>: service ok ',
          service,
          '\n\n\n\n\n\n',
        );
      }
      try {
        const props =
          await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
            service.id,
          );
        const newVmStates = [];
        const lastVmStates: LastVmStates = JSON.parse(props.lastVmStates);
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
          if (service.userId == 2250) {
            console.log(
              ' \n\n\n\n\n\n<debug_payg>: vm ok ',
              vm,
              '\n\n\n\n\n\n',
            );
          }
          const containerId = vm.container.split('/').slice(-1)[0];
          const id = vm.href.split('/').slice(-1)[0];
          const sortAsc = 'timestamp';
          const convertedVmStatus =
            VmStatusEnum[vm.status] === VmStatusEnum.POWERED_ON
              ? VmPowerStateEventEnum.PowerOn
              : VmPowerStateEventEnum.PowerOff;
          const newState = {
            id,
            state: convertedVmStatus,
          };
          newVmStates.push(newState);
          const urnVmId = 'urn:vcloud:vm:' + id.replace('vm-', '');
          const urnContainerId =
            'urn:vcloud:vapp:' + containerId.replace('vapp-', '');
          const offset = service.offset.toISOString();
          let lastState =
            lastVmStates.vmStates.find((item) => item.id === id)?.state ??
            VmPowerStateEventEnum.PowerOff;
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
          const hasEvent = events.data.values.length > 0;
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
          if (
            events.data.values.length % 2 === 1 &&
            lastState === VmPowerStateEventEnum.PowerOn
          ) {
            const computeItems =
              await this.paygCostCalculationService.calculateVdcPaygVm(
                service,
                startDate,
                new Date(),
                vm.numberOfCpus,
                vm.memoryMB,
              );
            totalVpcCost.push(computeItems);
          }
          if (!hasEvent && lastState === VmPowerStateEventEnum.PowerOn) {
            const computeItems =
              await this.paygCostCalculationService.calculateVdcPaygVm(
                service,
                new Date(offset),
                new Date(),
                vm.numberOfCpus,
                vm.memoryMB,
              );
            totalVpcCost.push(computeItems);
          }
        }
        const sum = this.sumComputeItems(totalVpcCost);
        const duration = new Date().getTime() - service.offset.getTime();
        const durationInMin = Math.round(duration / 1000 / 60);
        const totalCost =
          await this.paygCostCalculationService.calculateVdcPaygService(
            sum,
            service,
            durationInMin,
          );
        const serviceItems = await this.serviceItemsTableService.find({
          where: {
            serviceInstanceId: service.id,
          },
        });
        const minutes = 60 * 24;
        const groupedItems = null;
        const applyTemplateDiscount = true;
        const transferredItems = transferItems(serviceItems);
        const fullTimeCost =
          await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(
            {
              itemsTypes: transferredItems,
              duration: 1,
            },
            minutes,
            groupedItems,
            applyTemplateDiscount,
            service,
          );
        try {
          if (service.userId == 2250) {
            console.log(
              ' \n\n\n\n\n\n<debug_payg>: try ok ',
              fullTimeCost,
              totalCost,
              '\n\n\n\n\n\n',
            );
          }
          await this.budgetingService.paidFromBudgetCredit(
            service.id,
            {
              paidAmount: totalCost.totalCost,
              paidAmountForNextPeriod: fullTimeCost.totalCost / 24,
            },
            [totalCost, { durationInMin }, totalVpcCost],
          );
          if (service.userId == 2250) {
            console.log(
              ' \n\n\n\n\n\n<debug_payg>: budget ok ',
              '\n\n\n\n\n\n',
            );
          }
        } catch (err) {
          if (service.userId == 2250) {
            console.log(
              ' \n\n\n\n\n\n<debug_payg>: entered catch ',
              err,
              '\n\n\n\n\n\n',
            );
          }
          // console.log('paygError: ', err, service);
          if (
            ![
              ServiceStatusEnum.ExceededEnoughCredit,
              ServiceStatusEnum.ExceededEnoughCreditAndNotEnoughUserCredit,
            ].includes(service.status)
          ) {
            if (service.userId == 2250) {
              console.log(
                ' \n\n\n\n\n\n<debug_payg>: entered disabled ok ',
                '\n\n\n\n\n\n',
              );
            }
            await this.disablePaygService(
              props,
              service.id,
              tenantHeaders,
              adminSession,
              vmslist.data,
            );
            if (service.userId == 2250) {
              console.log(
                ' \n\n\n\n\n\n<debug_payg>: disable ok ',
                '\n\n\n\n\n\n',
              );
            }
          }
        }
        await this.serviceInstanceTableService.update(service.id, {
          offset: new Date(),
        });
        const newLastVmStates: LastVmStates = {
          vmStates: newVmStates,
        };
        await this.servicePropertiesTableService.updateAll(
          {
            propertyKey: VdcServiceProperties.LastVmStates,
            serviceInstanceId: service.id,
          },
          {
            value: JSON.stringify(newLastVmStates),
          },
        );
      } catch (err) {
        if (service.userId == 2250) {
          console.log(
            ' \n\n\n\n\n\n<debug_payg>: my catch ok ',
            err,
            '\n\n\n\n\n\n',
          );
        }
        console.log(err);
      }
    }
  }

  async createServiceDiscount(invoice: Invoices): Promise<void> {
    if (invoice.templateId) {
      const template = await this.templateTableService.findById(
        invoice.templateId,
      );
      const templateStructure: TemplatesStructure = JSON.parse(
        template.structure,
      );
      await this.extendService.createServiceDiscount({
        duration: templateStructure.duration,
        percent: templateStructure.percent ?? null,
        price: templateStructure.price ?? null,
        serviceInstanceId: invoice.serviceInstanceId,
      });
    }
  }

  sumComputeItems(invoiceItemsCost: InvoiceItemCost[][]): InvoiceItemCost[] {
    if (invoiceItemsCost.length === 0) {
      return [];
    }
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
      const ip = item.value.split(IP_SPLITTER)[0];
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
    await this.adminVdcWrapperService.disableVdc(session, props.vdcId);
    // await this.serviceInstanceTableService.update(serviceInstanceId, {
    //   status: ServiceStatusEnum.Disabled,
    // });
  }

  async createPaygVdcService(
    dto: CreateServiceDto,
    options: SessionRequest,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const invoice = await this.invoiceTableService.findById(dto.invoiceId);
    const invoiceItems = await this.invoiceItemsTableService.find({
      where: {
        invoiceId: invoice.id,
      },
    });
    const credit = await this.userInfoService.getUserCreditBy(userId);
    if (invoice.finalAmountWithTax > credit) {
      throw new NotEnoughCreditException();
    }
    const serviceInstanceId = await this.extendService.createServiceInstance(
      userId,
      invoice.serviceTypeId,
      null,
      invoice.name,
      invoice.datacenterName,
      ServicePlanTypeEnum.Payg,
      VmPowerStateEventEnum.PowerOff,
      new Date(),
    );
    await this.invoiceTableService.update(invoice.id, { serviceInstanceId });
    invoice.serviceInstanceId = serviceInstanceId;
    await this.createServiceDiscount(invoice);
    await this.extendService.createServiceItems(
      invoiceItems,
      serviceInstanceId,
    );
    await this.extendService.addGenIdToServiceProperties(
      invoiceItems,
      serviceInstanceId,
    );
    const lastVmStates: LastVmStates = {
      vmStates: [],
    };
    const stringifiedStates = JSON.stringify(lastVmStates);
    await this.servicePropertiesTableService.create({
      serviceInstanceId,
      propertyKey: VdcServiceProperties.LastVmStates,
      value: stringifiedStates,
    });
    await this.budgetingService.increaseBudgetingService(
      userId,
      serviceInstanceId,
      {
        increaseAmount: invoice.finalAmountWithTax,
      },
    );
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

  async getPaygVdcCalculator(dto: CreatePaygVdcServiceDto) {
    const cost =
      await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(dto);
    const filteredCostItems = [];
    for (const item of cost.itemsSum) {
      if (item?.code === undefined) {
        continue;
      }
      const parents = item.codeHierarchy.split(
        ITEM_TYPE_CODE_HIERARCHY_SPLITTER,
      );
      let targetCode = parents[3] ?? parents[2] ?? parents[1];
      if (
        parents[2] === VdcGenerationItemCodes.Cpu ||
        parents[2] === VdcGenerationItemCodes.Ram
      ) {
        targetCode = parents[2];
      }
      filteredCostItems.push({
        cost: Math.round(item.cost * 60),
        code: targetCode,
        value: item.value,
      });
    }
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: {
        propertyKey: SystemSettingsPropertyKeysEnum.TaxPercent,
      },
    });
    return {
      itemsPer: filteredCostItems,
      totalCost: Math.round(cost.totalCost),
      perHour: Math.round(cost.totalCost / dto.duration / 24),
      taxIncluded: Math.round(
        (Number(taxPercent.value) / 100 + 1) * cost.totalCost,
      ),
      taxPercent: Number(taxPercent.value),
    };
  }

  async upgradePayg(
    dto: CreateServiceDto,
    options: SessionRequest,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const invoice = await this.invoiceTableService.findById(dto.invoiceId);
    const credit = await this.userInfoService.getUserCreditBy(userId);
    const serviceBudgets = await this.budgetingService.getUserBudgeting(userId);
    const serviceBudget = serviceBudgets.find(
      (item) => item.id === invoice.serviceInstanceId,
    );
    if (invoice.finalAmountWithTax > credit + serviceBudget.credit) {
      throw new NotEnoughCreditException();
    }
    if (invoice.finalAmountWithTax > serviceBudget.credit) {
      const cost = invoice.finalAmountWithTax - serviceBudget.credit;
      await this.budgetingService.increaseBudgetingService(
        userId,
        invoice.serviceInstanceId,
        { increaseAmount: cost },
      );
    }
    await this.extendService.upgradeService(
      invoice.serviceInstanceId,
      invoice.id,
      invoice.type,
    );
    const task = await this.newTaskManagerService.createFlow(
      TasksEnum.UpgradeVdc,
      invoice.serviceInstanceId,
    );
    const taskId = task.taskId;
    await this.invoiceTableService.update(invoice.id, { payed: true });
    return {
      taskId,
    };
  }
}
