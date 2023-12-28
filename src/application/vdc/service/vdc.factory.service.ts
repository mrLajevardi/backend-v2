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
import { ProviderVdcStorageProfilesDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/provider-vdc-storage-profile.dto';
import { TasksListDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/task-list.dto';
import { AxiosResponse } from 'axios';
import { TaskQueryTypes } from 'src/application/base/tasks/enum/task-query-types.enum';
import { TasksEnum } from 'src/application/base/task-manager/enum/tasks.enum';

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
    modelBuilder.WithDescription(record.description);
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
        itemTypeId: item.itemTypeId,
        value: item.value,
      };
      return invoiceItem;
    });
    return transformedItems;
  }

  async getStorageProfiles(
    authToken: string,
    invoiceGroupItem: InvoiceGroupItem[],
    genId: string,
  ): Promise<VdcStorageProfileParams[]> {
    const storageProfiles =
      await this.vdcWrapperService.vcloudQuery<ProviderVdcStorageProfilesDto>(
        authToken,
        {
          type: 'providerVdcStorageProfile',
          format: 'records',
          page: 1,
          pageSize: 15,
          sortAsc: 'name',
          filter: `isEnabled==true;providerVdc==${genId}`,
        },
      );
    const vdcStorageProfileParams: VdcStorageProfileParams[] = [];
    const swapItem = invoiceGroupItem.find(
      (item) => item.code === DiskItemCodes.Swap,
    );
    const standardItem = invoiceGroupItem.find(
      (item) => item.code === DiskItemCodes.Standard,
    );
    const valueSum = Number(standardItem.value) + Number(swapItem.value);
    standardItem.value = valueSum.toString();
    invoiceGroupItem.splice(invoiceGroupItem.indexOf(swapItem), 1);

    for (const invoiceItem of invoiceGroupItem) {
      for (const storageProfile of storageProfiles.data.record) {
        if (
          storageProfile.name.toLowerCase().includes(invoiceItem.code) &&
          Number(invoiceItem.value) > 0
        ) {
          const isDefault = storageProfile.name
            .toLowerCase()
            .includes(DiskItemCodes.Standard)
            ? true
            : false;
          const storage: VdcStorageProfileParams = {
            _default: isDefault,
            default: isDefault,
            enabled: true,
            providerVdcStorageProfile: {
              href: storageProfile.href,
              name: storageProfile.name,
            },
            units: VdcUnits.StorageUnit,
            limit: Number(invoiceItem.value) * 1024,
          };
          vdcStorageProfileParams.push(storage);
        }
      }
    }
    return vdcStorageProfileParams;
  }

  checkVdcTask(
    session: string,
    filter: string,
    taskType: TaskQueryTypes,
    interval: number,
    taskName: string,
  ): Promise<AxiosResponse<TasksListDto>> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const checkIntervalFun = async (): Promise<void> => {
        try {
          const task = await this.vdcWrapperService.vcloudQuery<TasksListDto>(
            session,
            {
              type: taskType,
              page: 1,
              pageSize: 30,
              sortDesc: 'startDate',
              filter,
            },
          );
          if (task.data.record[0].status === 'error') {
            clearInterval(checkInterval);
            reject(new Error(`vdc task [${taskName}] failed`));
          } else if (task.data.record[0].status === 'success') {
            clearInterval(checkInterval);
            resolve(task);
          }
        } catch (err) {
          clearInterval(checkInterval);
          reject(err);
        }
      };
      const checkInterval = setInterval(checkIntervalFun, interval);
      await checkIntervalFun();
    });
  }
}
