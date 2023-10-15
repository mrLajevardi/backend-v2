import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { GetServicesReturnDto } from '../../base/service/dto/return/get-services.dto';
import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ServiceInstancesTableService } from '../../base/crud/service-instances-table/service-instances-table.service';
import { GetAllVdcServiceWithItemsResultDto } from '../../base/service/dto/get-all-vdc-service-with-items-result.dto';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { ServiceServiceFactory } from '../../base/service/Factory/service.service.factory';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcFactoryService } from './vdc.factory.service';
import { ServiceItems } from '../../../infrastructure/database/entities/ServiceItems';
import { ServiceItemTypesTree } from '../../../infrastructure/database/entities/views/service-item-types-tree';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcModel } from '../interface/vdc-model.interface';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';
import { InvoiceFactoryVdcService } from '../../base/invoice/service/invoice-factory-vdc.service';
import { VdcDetailFecadeService } from './vdc-detail.fecade.service';
import { VdcDetailModel } from '../interface/vdc-detail-model.interface';

@Injectable()
export class VdcDetailFactoryService {
  constructor(
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
    private readonly vdcDetailFecadeService: VdcDetailFecadeService,
  ) {}

  getVdcDetailItemModel(vdcModels: VdcModel[], res2: VdcDetailsResultDto) {
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
    } = this.invoiceVdcFactory.getVdcInvoiceDetailInfo(vdcModels);

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
  }

  fillVdcDetailModel(
    servicesModels: VdcDetailModel[],
    res2: VdcDetailsResultDto,
  ) {
    const vdcModels = servicesModels.map((model) => {
      const res: VdcModel = {
        code: model.code,
        value: model.value,
        codeHierarchy: model.codeHierarchy,
        title: model.title,
        datacenterName: model.datacenterName,
        itemID: model.itemTypeId,
        parentCode: '',
        unit: model.unit,
        serviceName: model.name,
        status: model.status,
        daysLeft: model.daysLeft,
        servicePlanType: model.servicePlanType,
      };
      return res;
    });
    res2.serviceName = vdcModels[0].serviceName;
    res2.daysLeft = vdcModels[0].daysLeft;
    res2.status = vdcModels[0].status;
    res2.servicePlanType = vdcModels[0].servicePlanType;

    return vdcModels;
  }

  async getStatusOfVdcItems(option: SessionRequest, serviceInstanceId: string) {
    const countOfNetworks =
      await this.vdcDetailFecadeService.NetworkService.getCountOfAllNetworks(
        option,
        serviceInstanceId,
      );

    //this does not have any totalsNumber
    const countOfNat =
      await this.vdcDetailFecadeService.NatService.getCountOfNatRules(
        option,
        serviceInstanceId,
      );

    const countOfFireWalls =
      await this.vdcDetailFecadeService.FirewallService.getCountOfFireWall(
        option,
        serviceInstanceId,
      );

    const countOfIpSet =
      await this.vdcDetailFecadeService.EdgeGatewayService.getCountOfIpSet(
        option,
        serviceInstanceId,
      );
    //TODO
    const countOfApplicationPort =
      await this.vdcDetailFecadeService.ApplicationPortProfileService.getCountOfApplicationPort(
        option,
        serviceInstanceId,
      );

    const countOfNamedDisk = (
      await this.vdcDetailFecadeService.VdcService.getNamedDisk(
        option,
        serviceInstanceId,
      )
    ).length;
    const countOfFiles =
      await this.vdcDetailFecadeService.VmService.getCountOfFiles(
        option,
        serviceInstanceId,
      );
    const statusOfDhcpForwarderStatus = (
      await this.vdcDetailFecadeService.EdgeGatewayService.getDhcpForwarder(
        option,
        serviceInstanceId,
      )
    ).enabled;
    return {
      countOfNetworks,
      countOfNat,
      countOfFireWalls,
      countOfIpSet,
      countOfApplicationPort,
      countOfNamedDisk,
      countOfFiles,
      statusOfDhcpForwarderStatus,
    };
  }
  async getVdcDetailModel(
    serviceInstanceId: string,
  ): Promise<VdcDetailModel[]> {
    const serviceTypeWhere = 'vdc';
    const servicesModels = await this.serviceInstanceTableService
      .getQueryBuilder()
      .select(
        'serviceInstances.Name , serviceInstances.Status , serviceInstances.DaysLeft , serviceInstances.ServicePlanType ',
      )
      .where('serviceInstances.ServiceTypeID = :serviceTypeId ', {
        // invoiceId: invoiceId,
        serviceTypeId: serviceTypeWhere,
      })
      .where('serviceInstances.ID = :serviceInstanceId', {
        serviceInstanceId: serviceInstanceId,
      })
      .innerJoin(
        ServiceItems,
        'ServiceItems',
        'ServiceItems.ServiceInstanceID = serviceInstances.ID',
      )
      .addSelect('ServiceItems.Value , ServiceItems.ItemTypeID  ')
      .innerJoin(
        ServiceItemTypesTree,
        'SIT',
        'SIT.ID = ServiceItems.ItemTypeID',
      )
      .addSelect(
        'SIT.CodeHierarchy ,SIT.DatacenterName , SIT.Code , SIT.Title , SIT.Unit , SIT.Min , SIT.Max ',
      )
      .getRawMany();
    const res = servicesModels.map((model) => {
      return new VdcDetailModel(model);
    });
    return res;
  }
}
