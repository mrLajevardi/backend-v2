import { Injectable } from '@nestjs/common';

import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';
import { getDateMinusDay } from '../../../infrastructure/utils/extensions/date.extension';

@Injectable()
export class VmDetailFactoryService {
  // formatDate(date: Date) {
  //   return (
  //     [
  //       date.getFullYear(),
  //       this.padTo2Digits(date.getMonth() + 1),
  //       this.padTo2Digits(date.getDate()),
  //     ].join('-') +
  //     ' ' +
  //     [
  //       this.padTo2Digits(date.getHours()),
  //       this.padTo2Digits(date.getMinutes()),
  //       this.padTo2Digits(date.getSeconds()),
  //     ].join(':')
  //   );
  // }

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
          filterDate = `${fieldName}=le=${date2}`;
          break;
        case SortDateTypeEnum.YesterDay:
          // const tt = date.toISOString();
          //2023-11-13T08:02:40.815Z
          filterDate = `${fieldName}=lt=${date2.trim()};${fieldName}=ge=${getDateMinusDay(
            date,
            1,
          )
            .toISOString()
            .trim()}`;
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
}
