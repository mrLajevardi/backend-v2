import { BaseVdcDetailService } from '../interface/service/base-vdc-detail-service.interface';
import { AdminOrgVdcStorageProfileQuery } from '../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { VdcInvoiceDetailsInfoResultDto } from '../dto/vdc-invoice-details-info.result.dto';
import {
  ItemTypeCodes,
  VdcGenerationItemCodes,
  VdcGenerationItemUnit,
} from '../../base/itemType/enum/item-type-codes.enum';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { ServiceInstancesTableService } from '../../base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemTypesTree } from '../../../infrastructure/database/entities/views/service-item-types-tree';
import { ServiceItems } from '../../../infrastructure/database/entities/ServiceItems';
import { VdcModel } from '../interface/vdc-model.interface';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';
import { InvoiceFactoryVdcService } from '../../base/invoice/service/invoice-factory-vdc.service';
import {
  BASE_SERVICE_ITEM_SERVICE,
  BaseServiceItem,
} from '../../base/service-item/interface/service/service-item.interface';
import { VdcDetailFactoryService } from './vdc-detail.factory.service';
import { VdcDetailItemResultDto } from '../dto/vdc-detail-item.result.dto';
import { VdcDetailFecadeService } from './vdc-detail.fecade.service';
import { VdcItemLimitResultDto } from '../dto/vdc-Item-limit.result.dto';
import { VdcItemLimitQueryDto } from '../dto/vdc-item-limit.query.dto';

@Injectable()
export class VdcDetailService implements BaseVdcDetailService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vdcDetailFactory: VdcDetailFactoryService,
    private readonly servicePropertiesService: ServicePropertiesService,
    @Inject(BASE_SERVICE_ITEM_SERVICE)
    private readonly serviceItemService: BaseServiceItem,
  ) {}
  async getStorageDetailVdc(
    serviceInstanceId: string,
  ): Promise<VdcInvoiceDetailsInfoResultDto[]> {
    const res: VdcInvoiceDetailsInfoResultDto[] = [];

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
      res.push({
        title: disk.name,
        usage: disk.storageUsedMB,
        value: disk.storageLimitMB.toString(),
        code: VdcGenerationItemCodes.Disk,
        price: 0,
        unit: 'MB',
      });
    });

    return Promise.resolve(res);
  }

  async getVdcDetail(serviceInstanceId: string): Promise<VdcDetailsResultDto> {
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

    this.vdcDetailFactory.getVdcDetailItemModel(vdcModels, res2);

    res2.guaranty.title = await this.serviceItemService.getGuarantyTitleBy(
      serviceInstanceId,
    );

    res2.disk = await this.getStorageDetailVdc(serviceInstanceId);

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
  ): Promise<VdcItemLimitResultDto> {
    if (!serviceInstanceId) return {};
    const query: VdcItemLimitQueryDto = {
      ramCode: VdcGenerationItemCodes.Ram,
      cpuCode: VdcGenerationItemCodes.Cpu,
      diskCode: VdcGenerationItemCodes.Disk,
      ramUnit: VdcGenerationItemUnit.Ram,
      cpuUnit: VdcGenerationItemUnit.Cpu,
      diskUnit: VdcGenerationItemUnit.Disk,
      serviceInstanceId: serviceInstanceId,
    };
    const model = await this.vdcDetailFactory.getVdcItemLimit(query);

    return model;
  }
}
