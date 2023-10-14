import { GetServicesReturnDto } from '../dto/return/get-services.dto';
import { GetOrgVdcResult } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { GetAllVdcServiceWithItemsResultDto } from '../dto/get-all-vdc-service-with-items-result.dto';
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

@Injectable()
export class ServiceServiceFactory {
  constructor(
    private readonly systemSettingsService: SystemSettingsTableService,
    @Inject(BASE_SERVICE_PROPERTIES_SERVICE)
    private readonly serviceInstancePropertiesService: BaseServicePropertiesService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
  ) {}
  public async getPropertiesOfServiceInstance(
    serviceInstance: GetServicesReturnDto,
  ) {
    const miliSecondTime = 86400000;

    //serviceInstance.expireDate return milisecond and for that we have to convert it days ===>miliSecondTime

    // const daysLeft = Math.floor(
    //   (serviceInstance.daysLeft.expireDate.getTime() - new Date().getTime()) /
    //     miliSecondTime,
    // );
    const daysLeft = serviceInstance.daysLeft;

    //ExpiredDate
    const isExpired = daysLeft < 0;

    //Ticket Sent

    const errorCountRate = (
      await this.systemSettingsService.findOne({
        where: { propertyKey: 'ErrorSentRateLimit' },
      })
    ).value;

    const isTicketSent =
      Number(errorCountRate.trim()) <= serviceInstance.retryCount;
    return { daysLeft, isExpired, isTicketSent };
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

  public configModelServiceInstanceList(
    serviceInstance: GetServicesReturnDto,
    isExpired: boolean,
    daysLeft: number,
    isTicketSent: boolean,
    vdcItems: GetOrgVdcResult,
    cpuSpeed: string | number | boolean,
  ) {
    const model: GetAllVdcServiceWithItemsResultDto =
      new GetAllVdcServiceWithItemsResultDto(
        serviceInstance.id,
        serviceInstance.status as ServiceStatusEnum,
        serviceInstance.isDeleted,
        serviceInstance.name,
        serviceInstance.serviceType.id,
        [],
        // isExpired,
        daysLeft,
        isTicketSent,
        ServicePlanTypeEnum.Static, //TODO ==> it is null for all of service instances in our database
      );

    //Cpu , Ram , Disk , Vm
    const { serviceItemCpu, serviceItemRam, serviceItemDisk, serviceItemVM } =
      this.createItemTypesForInstance(vdcItems, cpuSpeed);

    model.serviceItems.push(serviceItemCpu);
    model.serviceItems.push(serviceItemRam);
    model.serviceItems.push(serviceItemDisk);
    model.serviceItems.push(serviceItemVM);
    return model;
  }

  private createItemTypesForInstance(
    vdcItems: GetOrgVdcResult,
    cpuSpeed: string | number | boolean,
  ) {
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
      'Disk',
      vdcItems.storageUsedMB,
      vdcItems.storageLimitMB,
    );

    const serviceItemVM = new ServiceItemDto(
      'VM',
      vdcItems.numberOfRunningVMs,
      vdcItems.numberOfVMs,
    );
    return { serviceItemCpu, serviceItemRam, serviceItemDisk, serviceItemVM };
  }
}
