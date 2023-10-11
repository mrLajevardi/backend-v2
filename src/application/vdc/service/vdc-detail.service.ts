import { BaseVdcDetailService } from '../interface/service/base-vdc-detail-service.interface';
import { AdminOrgVdcStorageProfileQuery } from '../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { VdcInvoiceDetailsInfoResultDto } from '../dto/vdc-invoice-details-info.result.dto';
import { VdcGenerationItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
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
    options: SessionRequest,
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

  async getVdcDetail(
    serviceInstanceId: string,
    option: SessionRequest,
  ): Promise<VdcDetailsResultDto> {
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

    res2.disk = await this.getStorageDetailVdc(serviceInstanceId, option);

    return res2;
  }
}
