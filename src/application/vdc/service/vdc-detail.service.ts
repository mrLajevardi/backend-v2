import { BaseVdcDetailService } from '../interface/service/base-vdc-detail-service.interface';
import { AdminOrgVdcStorageProfileQuery } from '../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class VdcDetailService implements BaseVdcDetailService {
  constructor(
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
    private readonly sessionService: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
  ) {}
  async getStorageDetailVdc(
    vdcId: string,
    options: SessionRequest,
  ): Promise<VdcInvoiceDetailsInfoResultDto[]> {
    const res: VdcInvoiceDetailsInfoResultDto[] = [];

    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcId,
    );
    const authToken = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
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
          filter: `vdc==${vdcId}`,
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
    const res2: VdcDetailsResultDto = {};
    const serviceTypeWhere = 'vdc';
    const queryBuilder = await this.serviceInstanceTableService
      .getQueryBuilder()
      .select('serviceInstances.Name')
      .where('serviceInstances.ServiceTypeID = :serviceTypeId ', {
        // invoiceId: invoiceId,
        serviceTypeId: serviceTypeWhere,
      })
      .innerJoin(
        ServiceItems,
        'ServiceItems',
        'ServiceItems.ServiceInstanceID = serviceInstances.ID',
      )
      .addSelect('ServiceItems.Value , ServiceItems.ItemID  ')
      .innerJoin(ServiceItemTypesTree, 'SIT', 'SIT.ID = ServiceItems.ItemID')
      .addSelect(
        'SIT.CodeHierarchy ,SIT.DatacenterName , SIT.Code , SIT.Title , SIT.Unit , SIT.Min , SIT.Max ',
      )
      .getRawMany();

    const r = queryBuilder.map((model) => {
      const res: VdcModel = {
        code: model.Code,
        value: model.Value,
        codeHierarchy: model.CodeHierarchy,
        title: model.Title,
        datacenterName: model.DatacenterName,
        itemID: model.ItemID,
        parentCode: '',
        unit: model.Unit,
        serviceName: model.Name,
        // servicePlanType: ServicePlanTypeEnum.Payg
        // code: model.Code,
        // value: model.Value,
        // codeHierarchy: model.CodeHierarchy,
        // title: model.Title,
        // datacenterName: model.DatacenterName,
        // fee: model.Fee,
        // rawAmount: model.RawAmount,
        // finalAmount: model.FinalAmount,
        // dateTime: model.DateTime,
        // itemID: model.ItemID,
        // parentCode: '',
        // unit: model.Unit,
        // max: model.Max,
        // min: model.Min,
      };
      return res;
    });

    const {
      cpuModel,
      ramModel,
      diskModel,
      ipModel,
      vmModel,
      generation,
      reservationRam,
      reservationCpu,
      period,
      guaranty,
    } = this.invoiceVdcFactory.getVdcInvoiceDetailInfo(r);

    this.invoiceVdcFactory.fillRes(
      res2,
      cpuModel as InvoiceDetailVdcModel,
      ramModel as InvoiceDetailVdcModel,
      diskModel as InvoiceDetailVdcModel[],
      ipModel as InvoiceDetailVdcModel,
      generation,
      reservationCpu,
      reservationRam,
      vmModel as InvoiceDetailVdcModel,
      guaranty,
      period,
    );

    return res2;
  }
}
