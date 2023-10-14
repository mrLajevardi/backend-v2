import { Injectable } from '@nestjs/common';

import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { GetVdcOrgVdcBuilderResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.builder.result';

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
}
