import { GetServicesReturnDto } from '../dto/return/get-services.dto';
import { GetOrgVdcResult } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import {
  GetAllVdcServiceWithItemsResultDto,
  TaskDetail,
} from '../dto/get-all-vdc-service-with-items-result.dto';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { ServiceItemDto } from '../dto/service-item.dto';
import { Inject, Injectable } from '@nestjs/common';
import {
  BASE_SERVICE_PROPERTIES_SERVICE,
  BaseServicePropertiesService,
} from '../../crud/service-properties-table/interfaces/service-properties.service.interface';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../../datacenter/interface/datacenter.interface';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { EdgeGatewayService } from '../../../edge-gateway/service/edge-gateway.service';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { TasksService } from '../../tasks/service/tasks.service';
import { Tasks } from '../../../../infrastructure/database/entities/Tasks';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoiceFactoryService } from '../../invoice/service/invoice-factory.service';
import { InvoiceItemsDto } from '../../invoice/dto/create-service-invoice.dto';
import { AdminEdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import { SessionsService } from '../../sessions/sessions.service';
import { InsufficientResourceException } from 'src/infrastructure/exceptions/insufficient-resource.exception';

@Injectable()
export class ServiceServiceFactory {
  constructor(
    private readonly systemSettingsService: SystemSettingsTableService,
    @Inject(BASE_SERVICE_PROPERTIES_SERVICE)
    private readonly serviceInstancePropertiesService: BaseServicePropertiesService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
    private readonly edgeGatewayService: EdgeGatewayService,
    private readonly taskService: TasksService,
    private readonly invoiceItemsTableService: InvoiceItemsTableService,
    private readonly invoiceFactoryService: InvoiceFactoryService,
    private readonly adminEdgegatewayWrapperService: AdminEdgeGatewayWrapperService,
    private readonly sessionService: SessionsService,
  ) {}
  public async getPropertiesOfServiceInstance(
    serviceInstance: GetServicesReturnDto,
  ) {
    const daysLeft = serviceInstance.daysLeft;

    //ExpiredDate

    //Ticket Sent

    const errorCountRate = (
      await this.systemSettingsService.findOne({
        where: { propertyKey: 'ErrorSentRateLimit' },
      })
    ).value;

    const isTicketSent =
      Number(errorCountRate.trim()) <= serviceInstance.retryCount;
    return { daysLeft, isTicketSent };
  }

  public async getConfigServiceInstance(serviceInstance: GetServicesReturnDto) {
    const genIdKeyName = 'genId';

    const genid = await this.serviceInstancePropertiesService.getValueBy(
      serviceInstance.id,
      genIdKeyName,
    );

    const metaData = await this.datacenterService.getDatacenterMetadata(
      serviceInstance.name,
      genid,
    );
    return metaData;
  }

  public async configModelServiceInstanceList(
    serviceInstance: GetServicesReturnDto,
    option: SessionRequest,
    isTicketSent: boolean,
    vdcItems: GetOrgVdcResult,
    cpuSpeed: string | number | boolean,
  ) {
    async function getTask() {
      let task: Tasks = null;
      let taskDetail: TaskDetail = null;
      if (serviceInstance.status == ServiceStatusEnum.Error) {
        task = await this.taskService.getLastTaskErrorBy(serviceInstance.id);
        taskDetail = {
          details: task.details,
          startTime: task.startTime,
          taskId: task.taskId,
          operation: task.operation,
          currentStep: task.currentStep,
        };
      }
      return taskDetail;
    }

    const taskDetail = await getTask.call(this);

    const model: GetAllVdcServiceWithItemsResultDto =
      new GetAllVdcServiceWithItemsResultDto(
        serviceInstance.id,
        serviceInstance.status as ServiceStatusEnum,
        serviceInstance.isDeleted,
        serviceInstance.name,
        serviceInstance.serviceType.id,
        [],
        serviceInstance.daysLeft,
        isTicketSent,
        ServicePlanTypeEnum.Static, //TODO ==> it is null for all of service instances in our database
        taskDetail,
        vdcItems.description ? vdcItems.description : '',
      );

    //Cpu , Ram , Disk , Vm
    const {
      serviceItemCpu,
      serviceItemRam,
      serviceItemDisk,
      serviceItemVM,
      serviceItemIp,
    } = await this.createItemTypesForInstance(
      vdcItems,
      cpuSpeed,
      option,
      serviceInstance.id,
    );

    model.serviceItems.push(serviceItemCpu);
    model.serviceItems.push(serviceItemRam);
    model.serviceItems.push(serviceItemDisk);
    model.serviceItems.push(serviceItemVM);
    model.serviceItems.push(serviceItemIp);
    return model;
  }

  public async createItemTypesForInstance(
    vdcItems: GetOrgVdcResult,
    cpuSpeed: string | number | boolean,
    option: SessionRequest,
    serviceInstanceId: string,
  ) {
    const countIp = await this.edgeGatewayService.getCountOfIpSet(
      option,
      serviceInstanceId,
    );

    const serviceItemCpu = new ServiceItemDto(
      'CPU',
      vdcItems.cpuUsedMhz / Number(cpuSpeed),
      vdcItems.cpuAllocationMhz / Number(cpuSpeed),
    );

    const serviceItemRam = new ServiceItemDto(
      'RAM',
      vdcItems.memoryUsedMB,
      vdcItems.memoryAllocationMB,
    );

    const serviceItemDisk = new ServiceItemDto(
      'DISK',
      vdcItems.storageUsedMB,
      vdcItems.storageLimitMB,
    );

    const serviceItemVM = new ServiceItemDto(
      'VM',
      vdcItems.numberOfRunningVMs,
      vdcItems.numberOfVMs,
    );

    const serviceItemIp = new ServiceItemDto('IP', countIp, countIp);

    return {
      serviceItemCpu,
      serviceItemRam,
      serviceItemDisk,
      serviceItemVM,
      serviceItemIp,
    };
  }

  async checkResources(invoiceId: number): Promise<void> {
    const invoiceItems = await this.invoiceItemsTableService.find({
      where: {
        invoiceId,
      },
    });
    const transformedInvoiceItems = invoiceItems.map((item) => {
      const invoiceItemType: InvoiceItemsDto = {
        itemTypeId: item.id,
        value: item.value,
      };
      return invoiceItemType;
    });
    const groupItems = await this.invoiceFactoryService.groupVdcItems(
      transformedInvoiceItems,
    );
    const adminSession = await this.sessionService.checkAdminSession();
    const externalNetworks =
      await this.adminEdgegatewayWrapperService.findExternalNetwork(
        adminSession,
        1,
        1,
      );
    try {
      await this.adminEdgegatewayWrapperService.ipAllocation(
        externalNetworks.values[0].id,
        adminSession,
        Number(groupItems.generation.ip[0].value),
      );
    } catch {
      throw new InsufficientResourceException();
    }
  }
}
