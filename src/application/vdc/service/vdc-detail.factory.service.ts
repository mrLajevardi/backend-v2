import { SessionRequest } from '../../../infrastructure/types/session-request.type';

import { Injectable } from '@nestjs/common';
import { ServiceInstancesTableService } from '../../base/crud/service-instances-table/service-instances-table.service';
import { ServiceItems } from '../../../infrastructure/database/entities/ServiceItems';
import { ServiceItemTypesTree } from '../../../infrastructure/database/entities/views/service-item-types-tree';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { VdcModel } from '../interface/vdc-model.interface';
import { InvoiceDetailVdcModel } from '../../base/invoice/interface/invoice-detail-vdc.interface';
import { InvoiceFactoryVdcService } from '../../base/invoice/service/invoice-factory-vdc.service';
import { VdcDetailFecadeService } from './vdc-detail.fecade.service';
import { VdcDetailModel } from '../interface/vdc-detail-model.interface';
import {
  DiskTypeItemLimitInfo,
  VdcItemLimitResultDto,
} from '../dto/vdc-Item-limit.result.dto';
import { VdcStoragesDetailResultDto } from '../dto/vdc-storages-detail.result.dto';
import { UserPayload } from '../../base/security/auth/dto/user-payload.dto';
import { VmService } from '../../vm/service/vm.service';
import { DiskItemCodes } from '../../base/itemType/enum/item-type-codes.enum';

@Injectable()
export class VdcDetailFactoryService {
  constructor(
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
    private readonly invoiceVdcFactory: InvoiceFactoryVdcService,
    private readonly vdcDetailFecadeService: VdcDetailFecadeService,
    private readonly vmService: VmService,
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
    if (
      vdcModels === null ||
      vdcModels === undefined ||
      vdcModels.length == 0
    ) {
      return [];
    }
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
  fillModelVdcItemLimit(
    model: VdcItemLimitResultDto,
    vdcDetail: VdcDetailsResultDto,
    cpuCoreUsageVmOffs: number,
    ramUsageVmOffs: number,
    diskItemsModel: VdcStoragesDetailResultDto[],
  ) {
    model.cpuInfo.max = Number(vdcDetail.cpu.value);

    model.cpuInfo.maxUsableWithOnVMs =
      Number(vdcDetail.cpu.value) - Number(vdcDetail.cpu.usage);

    model.cpuInfo.maxUsableWithOffVMs =
      Number(vdcDetail.cpu.value) - cpuCoreUsageVmOffs;
    model.cpuInfo.maxUsableWithOffAndOnVMs =
      Number(vdcDetail.cpu.value) -
      (cpuCoreUsageVmOffs + Number(vdcDetail.cpu.usage));

    //////////////////////////////////////////////////
    model.ramInfo.max = Number(vdcDetail.ram.value);

    model.ramInfo.maxUsableWithOnVMs =
      Number(vdcDetail.ram.value) - Number(vdcDetail.ram.usage);

    model.ramInfo.maxUsableWithOffVMs =
      Number(vdcDetail.ram.value) - ramUsageVmOffs;

    model.ramInfo.maxUsableWithOffAndOnVMs =
      Number(vdcDetail.ram.value) -
      (cpuCoreUsageVmOffs + Number(vdcDetail.ram.usage));

    const itemsDiskCodes = Object.keys(DiskItemCodes);
    let diskCode = '';
    model.diskInfo = diskItemsModel.map((storage) => {
      // there is should be convention here for naming disk policy

      itemsDiskCodes.forEach((item) => {
        if (storage.title.includes(item)) {
          diskCode = item.toLowerCase();
        }
      });

      return {
        max: storage.value,
        usage: storage.usage,
        code: diskCode,
        name: storage.title,
        id: storage.id,
      } as DiskTypeItemLimitInfo;
    });
  }

  async calcComputeVdcItemByVms(
    option: Request & {
      user: UserPayload;
    },
    serviceInstanceId: string,
  ) {
    const vmFilters = 'status==POWERED_OFF';
    const vmOffs = await this.vmService.getAllUserVm(
      option,
      serviceInstanceId,
      vmFilters,
      '',
    );
    let ramUsageVmOffs = 0;
    let cpuCoreUsageVmOffs = 0;
    vmOffs.values.map((vm) => {
      ramUsageVmOffs += vm.memory;
      cpuCoreUsageVmOffs += vm.cpu;
    });
    return { ramUsageVmOffs, cpuCoreUsageVmOffs };
  }
}
