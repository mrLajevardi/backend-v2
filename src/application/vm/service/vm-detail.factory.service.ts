import { Injectable } from '@nestjs/common';

import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';
import { getDateMinusDay } from '../../../infrastructure/utils/extensions/date.extension';
import { VmStatusEnum } from '../enums/vm-status.enum';
import { groupBy } from '../../../infrastructure/utils/extensions/array.extensions';
import { DiskBusUnitBusNumberSpace } from '../../../wrappers/mainWrapper/user/vm/diskBusUnitBusNumberSpace';
import { ExceedEnoughDiskCountException } from '../exceptions/exceed-enough-disk-count.exception';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';

@Injectable()
export class VmDetailFactoryService {
  constructor(private readonly baseFactoryException: BaseFactoryException) {}
  filterDateVmDetails(
    startDate: Date,
    endDate: Date,
    dateFilter: SortDateTypeEnum,
    fieldName: string,
  ): string {
    const date2 = new Date().toISOString();
    let filterDate = `${fieldName}=le=${date2};`;
    if (startDate != null && endDate != null) {
      filterDate = `${fieldName}=le=${endDate.toISOString()};${fieldName}=ge=${startDate.toISOString()}`;
    } else {
      const date = new Date();
      switch (Number(dateFilter)) {
        case SortDateTypeEnum.Today:
          filterDate = `${fieldName}=lt=${date2};${fieldName}=gt=${getDateMinusDay(
            date,
            1,
          )
            .toISOString()
            .trim()};`;
          break;
        case SortDateTypeEnum.YesterDay:
          // const tt = date.toISOString();
          //2023-11-13T08:02:40.815Z
          filterDate = `${fieldName}=lt=${date2.trim()};${fieldName}=ge=${getDateMinusDay(
            date,
            2,
          )
            .toISOString()
            .trim()};`;
          break;
        case SortDateTypeEnum.LastWeek:
          filterDate = `${fieldName}=le=${date.toISOString()};${fieldName}=ge=${getDateMinusDay(
            date,
            7,
          ).toISOString()};`;
          break;
        case SortDateTypeEnum.LastMoth:
          filterDate = `${fieldName}=le=${date.toISOString()};${fieldName}=ge=${getDateMinusDay(
            date,
            30,
          ).toISOString()};`;
          break;
        case SortDateTypeEnum.MoreThanLastMonth:
          filterDate = `${fieldName}=le=${date2};`;
          break;
      }
    }

    return filterDate;
  }

  checkPutDiskValidation(data) {
    const res = groupBy(
      data,
      (setting) => (setting as any).adapterType.legacyId,
    );
    for (const key in res) {
      const busTypeInfo = DiskBusUnitBusNumberSpace.find(
        (bus) => bus.legacyId == Number(key),
      );

      const length = busTypeInfo.info.length;

      const list = res[key] as [];
      if (list.length > length) {
        this.baseFactoryException.handleWithArgs(
          ExceedEnoughDiskCountException,
          {
            args: {
              length: length,
              key: busTypeInfo.name,
            },
          },
        );
        // this.baseFactoryException.handle(NotEnoughCreditException);
        // return new ExceedEnoughDiskCountException(
        //   `You can not create more than ${length} items for busType ${key}`,
        // );
      }
    }
  }

  async getCountOfNetworksVm(
    forbiddenStatusVmsList: VmStatusEnum[],
    recordItem,
    options,
    serviceInstanceId: string,
    id,
  ) {
    if (forbiddenStatusVmsList.includes(recordItem.status)) {
      return 0;
    }
  }
}
