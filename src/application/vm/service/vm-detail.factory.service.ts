import { Injectable } from '@nestjs/common';

import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';
import { getDateMinusDay } from '../../../infrastructure/utils/extensions/date.extension';
import { VmStatusEnum } from '../enums/vm-status.enum';

@Injectable()
export class VmDetailFactoryService {
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
