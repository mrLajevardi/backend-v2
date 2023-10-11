import { Injectable } from '@nestjs/common';

import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { GetVdcOrgVdcBuilderResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.builder.result';
import { InvoiceFactoryVdcService } from 'src/application/base/invoice/service/invoice-factory-vdc.service';
import { ServiceItems } from 'src/infrastructure/database/entities/ServiceItems';
import { InvoiceItemsDto } from 'src/application/base/invoice/dto/create-service-invoice.dto';

@Injectable()
export class VdcFactoryService {
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
}
