import { BaseVdcDetailService } from '../interface/service/base-vdc-detail-service.interface';
import { AdminOrgVdcStorageProfileQuery } from '../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { VdcInvoiceDetailsInfoResultDto } from '../dto/vdc-invoice-details-info.result.dto';
import {
  DiskItemCodes,
  VdcGenerationItemCodes,
} from '../../base/itemType/enum/item-type-codes.enum';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import {
  BASE_SERVICE_ITEM_SERVICE,
  BaseServiceItem,
} from '../../base/service-item/interface/service/service-item.interface';
import { VdcDetailFactoryService } from './vdc-detail.factory.service';
import { VdcDetailItemResultDto } from '../dto/vdc-detail-item.result.dto';
import { VdcItemLimitResultDto } from '../dto/vdc-Item-limit.result.dto';
import { VmService } from '../../vm/service/vm.service';
import { VdcStoragesDetailResultDto } from '../dto/vdc-storages-detail.result.dto';
import { ServiceService } from '../../base/service/services/service.service';
import { GetAllVdcServiceWithItemsResultDto } from '../../base/service/dto/get-all-vdc-service-with-items-result.dto';
import { VdcDetailEditGeneralQuery } from '../dto/vdc-detail-edit-general.query';
import { BadRequestException } from '../../../infrastructure/exceptions/bad-request.exception';
import { CalcSwapStorage, GetCodeDisk } from '../utils/disk-functions.utils';
import { OrganizationTableService } from '../../base/crud/organization-table/organization-table.service';
import { GetVdcIdBy } from '../utils/vdc-properties.utils';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';
import { PaygCostCalculationService } from '../../base/invoice/service/payg-cost-calculation.service';
import { VServiceInstancesTableService } from '../../base/crud/v-service-instances-table/v-service-instances-table.service';
import { isNil } from 'lodash';
import { VServiceInstances } from '../../../infrastructure/database/entities/views/v-serviceInstances';
import { VServiceInstancesDetailTableService } from '../../base/crud/v-service-instances-detail-table/v-service-instances-detail-table.service';

@Injectable()
export class VdcDetailService implements BaseVdcDetailService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vdcDetailFactory: VdcDetailFactoryService,
    private readonly servicePropertiesService: ServicePropertiesService,
    @Inject(BASE_SERVICE_ITEM_SERVICE)
    private readonly serviceItemService: BaseServiceItem,
    private readonly serviceService: ServiceService,
    private readonly vmService: VmService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly vServiceInstancesDetailTableService: VServiceInstancesDetailTableService,
  ) {}
  async getStorageDetailVdc(
    serviceInstanceId: string,
  ): Promise<VdcStoragesDetailResultDto[]> {
    const res: VdcStoragesDetailResultDto[] = [];

    // const userId = options.user.userId; //TODO Check With Ali !!!!
    const props = await this.servicePropertiesService.getAllServiceProperties(
      serviceInstanceId,
    );

    // const authToken = await this.sessionService.checkUserSession(
    //   userId,
    //   props['orgId'],
    // ); //TODO Check With Ali !!!!
    const authToken = await this.sessionService.checkAdminSession();
    const vdcData =
      await this.vdcWrapperService.vcloudQuery<AdminOrgVdcStorageProfileQuery>(
        authToken,
        {
          type: 'adminOrgVdcStorageProfile',
          format: 'records',
          page: 1,
          pageSize: 128,
          filterEncoded: true,
          links: true,
          filter: `vdc==${props['vdcId']}`,
        },
      );

    vdcData.data.record.forEach((disk) => {
      const splitHref = disk.href.split('/');
      const diskId = splitHref[splitHref.length - 1];
      res.push({
        title: disk.name,
        usage: disk.storageUsedMB,
        value: disk.storageLimitMB,
        // code: VdcGenerationItemCodes.Disk,
        // price: 0,
        // unit: 'MB',
        id: diskId,
      });
    });

    return Promise.resolve(res);
  }

  async getVdcDetail(
    serviceInstanceId: string,
    option?: SessionRequest,
  ): Promise<VdcDetailsResultDto> {
    if (!serviceInstanceId) {
      return {};
    }

    const res2: VdcDetailsResultDto = {};
    const servicesModels = await this.vdcDetailFactory.getVdcDetailModel(
      serviceInstanceId,
    );

    if (servicesModels.length === 0) return {};

    const vdcModels = this.vdcDetailFactory.fillVdcDetailModel(
      servicesModels,
      res2,
    );

    const vdcDetails = (
      (await this.serviceService.getServicesWithItems(
        option,
        'vdc',
        serviceInstanceId,
      )) as GetAllVdcServiceWithItemsResultDto[]
    )[0];

    const vmServiceItem =
      await this.vServiceInstancesDetailTableService.findOne({
        where: {
          code: VdcGenerationItemCodes.Vm,
          serviceInstanceId: serviceInstanceId,
        },
      });

    this.vdcDetailFactory.getVdcDetailItemModel(vdcModels, res2);

    res2.vm.usage = vdcDetails.serviceItems.find(
      (service) =>
        service.itemTypeCode.toLowerCase().trim() == VdcGenerationItemCodes.Vm,
    ).usage;

    res2.cpu.usage = vdcDetails.serviceItems.find(
      (service) =>
        service.itemTypeCode.toLowerCase().trim() == VdcGenerationItemCodes.Cpu,
    ).usage;

    res2.ram.usage = vdcDetails.serviceItems.find(
      (service) =>
        service.itemTypeCode.toLowerCase().trim() == VdcGenerationItemCodes.Ram,
    ).usage;

    res2.guaranty.title = await this.serviceItemService.getGuarantyTitleBy(
      serviceInstanceId,
    );

    const diskModel = (await this.getStorageDetailVdc(serviceInstanceId)).map(
      async (storage) => {
        const diskCode = GetCodeDisk(storage.title);

        const res: VdcInvoiceDetailsInfoResultDto = {
          title: storage.title,
          usage: storage.usage,
          value: storage.value.toString(),
          code: diskCode,
          price: 0,
          unit: 'MB',
          tax: 0,
          priceWithTax: 0,
        };

        if (res.code == DiskItemCodes.Standard) {
          const storage = await CalcSwapStorage(
            {
              storageLimit: Number(res.value),
              storageUsed: res.usage,
              memoryAllocation: Number(res2.ram.value),
              serviceInstanceId: serviceInstanceId,
              numberOfVms: Number(vmServiceItem.value),
            },
            this.vmService,
            option as SessionRequest,
          );

          res.usage = Number(storage.used);
          res.value = storage.limit.toString();
        }

        return res;
      },
    );

    res2.disk = await Promise.all(diskModel);

    if (res2.servicePlanType == ServicePlanTypeEnum.Payg) {
      const vService: VServiceInstances =
        await this.vServiceInstancesTableService.findById(serviceInstanceId);
      res2.serviceCredit = vService.credit;
      res2.daysLeft =
        await this.paygCostCalculationService.calculateVdcPaygTimeDuration(
          serviceInstanceId,
        );
    }
    res2.extendable = vdcDetails.extendable;
    return res2;
  }

  async getVdcDetailItems(
    option: SessionRequest,
    serviceInstanceId: string,
  ): Promise<VdcDetailItemResultDto> {
    if (!serviceInstanceId) {
      return {};
    }

    const {
      countOfNetworks,
      countOfNat,
      countOfFireWalls,
      countOfIpSet,
      countOfApplicationPort,
      countOfNamedDisk,
      countOfFiles,
      statusOfDhcpForwarderStatus,
    } = await this.vdcDetailFactory.getStatusOfVdcItems(
      option,
      serviceInstanceId,
    );

    const res: VdcDetailItemResultDto = new VdcDetailItemResultDto(
      countOfNetworks,
      countOfNat,
      countOfFireWalls,
      countOfNamedDisk,
      countOfIpSet,
      statusOfDhcpForwarderStatus,
      {
        default: countOfApplicationPort.default,
        custom: countOfApplicationPort.custom,
      }, //TODO
      countOfFiles,
    );

    return res;
  }

  async getVdcItemLimit(
    serviceInstanceId: string,
    option: SessionRequest,
  ): Promise<VdcItemLimitResultDto> {
    if (!serviceInstanceId) return {};

    const model: VdcItemLimitResultDto = new VdcItemLimitResultDto({}, {}, []);
    const { ramUsageVmOffs, cpuCoreUsageVmOffs } =
      await this.vdcDetailFactory.calcComputeVdcItemByVms(
        option,
        serviceInstanceId,
      );
    const vdcDetail = await this.getVdcDetail(serviceInstanceId, option);
    const diskInfoModel = await this.getStorageDetailVdc(serviceInstanceId);
    this.vdcDetailFactory.fillModelVdcItemLimit(
      model,
      vdcDetail,
      cpuCoreUsageVmOffs,
      ramUsageVmOffs,
      diskInfoModel,
    );

    return model;
  }

  async editGeneralInfo(
    option: SessionRequest,
    query: VdcDetailEditGeneralQuery,
  ): Promise<string | BadRequestException> {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      query.serviceInstanceId,
    );

    if (
      props['vdcId'] == null ||
      props['orgId'] == null ||
      props['name'] == null
    )
      return new BadRequestException(
        'this vdc does not have any vdc id or org id ',
      );

    const authToken = (
      await this.sessionService.createUserSession(
        props['orgId'],
        option.user.userId,
      )
    ).token;

    const vdcId = GetVdcIdBy(props['vdcId']);

    const task = await this.vdcWrapperService.editGeneralInfo(
      vdcId,
      props['name'],
      query.description,
      authToken,
    );
    return task.__vcloudTask;
  }
}
