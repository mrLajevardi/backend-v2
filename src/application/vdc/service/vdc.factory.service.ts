import { Injectable } from '@nestjs/common';

import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { GetVdcOrgVdcBuilderResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.builder.result';
import { InvoiceFactoryVdcService } from 'src/application/base/invoice/service/invoice-factory-vdc.service';
import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { InvoiceItemsDto } from 'src/application/base/invoice/dto/create-service-invoice.dto';
import { StorageProfilesDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/storage-profile-dto';
import { VdcWrapperService } from 'src/wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcStorageProfileParams } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/create-vdc.dto';
import { DiskItemCodes } from 'src/application/base/itemType/enum/item-type-codes.enum';
import { VdcUnits } from '../enum/vdc-units.enum';
import { InvoiceGroupItem } from 'src/application/base/invoice/interface/vdc-item-group.interface.dto';

@Injectable()
export class VdcFactoryService {
  constructor(private readonly vdcWrapperService: VdcWrapperService) {}
  getVdcOrgVdcModelResult(vdcData: any): GetOrgVdcResult {
    const record = vdcData.data.record[0];
    if (record === undefined) return {};
    const modelBuilder: GetVdcOrgVdcBuilderResult =
      GetVdcOrgVdcBuilderResult.GetBuilder();
    modelBuilder.WithVdcName(record.name);
    modelBuilder.WithCpuAllocationMhz(record.cpuAllocationMhz);
    modelBuilder.WithCpuLimitMhz(record.cpuLimitMhz);
    modelBuilder.WithCpuUsedMhz(record.cpuUsedMhz);
    modelBuilder.WithCpuReservedMhz(record.cpuReservedMhz);
    modelBuilder.WithMemoryAllocationMB(record.memoryAllocationMB);
    modelBuilder.WithMemoryLimitMB(record.memoryLimitMB);
    modelBuilder.WithMemoryUsedMB(record.memoryUsedMB);
    modelBuilder.WithMemoryReservedMB(record.memoryReservedMB);
    modelBuilder.WithStorageLimitMB(record.storageLimitMB);
    modelBuilder.WithStorageUsedMB(record.storageUsedMB);
    modelBuilder.WithNumberOfDisks(record.numberOfDisks);
    modelBuilder.WithNumberOfVMs(record.numberOfVMs);
    modelBuilder.WithNumberOfRunningVMs(record.numberOfRunningVMs);
    const model: GetOrgVdcResult = modelBuilder.Build();
    return model;
  }

  transformItems(serviceItems: ServiceItems[]): InvoiceItemsDto[] {
    const transformedItems = serviceItems.map((item) => {
      const invoiceItem: InvoiceItemsDto = {
        itemTypeId: item.id,
        value: item.value,
      };
      return invoiceItem;
    });
    return transformedItems;
  }

  async getStorageProfiles(
    authToken: string,
    invoiceGroupItem: InvoiceGroupItem[],
  ): Promise<VdcStorageProfileParams[]> {
    const storageProfiles =
      await this.vdcWrapperService.vcloudQuery<StorageProfilesDto>(authToken, {
        type: 'storageProfile',
        format: 'records',
        page: 1,
        pageSize: 15,
        sortAsc: 'name',
      });
    const vdcStorageProfileParams: VdcStorageProfileParams[] = [];
    for (const invoiceItem of invoiceGroupItem) {
      for (const storageProfile of storageProfiles.data.records) {
        if (invoiceItem.code === storageProfile.name) {
          const isDefault =
            storageProfile.name === DiskItemCodes.Standard ? true : false;
          const storage: VdcStorageProfileParams = {
            _default: isDefault,
            default: isDefault,
            enabled: true,
            providerVdcStorageProfile: {
              href: storageProfile.href,
              name: storageProfile.name,
            },
            units: VdcUnits.StorageUnit,
            limit: Number(invoiceItem.value),
          };
          vdcStorageProfileParams.push(storage);
        }
      }
    }
    return vdcStorageProfileParams;
  }
}
