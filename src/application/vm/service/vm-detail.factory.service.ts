import { Injectable } from '@nestjs/common';
import { VmEventQueryDto } from '../dto/vm-event.query.dto';
import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';

@Injectable()
export class VmDetailFactoryService {
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

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
  formatDate(currentDate: Date): string {
    // const currentDate = new Date();

    // Get the formatted date and time string from toISOString()
    const isoString = currentDate.toISOString();

    // Extract individual components
    const yearMonthDay = isoString.slice(0, 10);
    const time = isoString.slice(11, 23);
    const timeZone = isoString.slice(23);

    // Create the formatted date and time string
    const formattedDateTime = `${yearMonthDay}T${time}${timeZone}`;

    return formattedDateTime;
  }

  filterTimeStampVmDetails(query: VmEventQueryDto) {
    // const now = new Date('now');
    // Date.
    "yyyy-MM-dd'T'HH:mm:ss.SSSXX";
    const date2 = this.formatDate(new Date());
    let filterDate = `timestamp=lt=${date2};`;
    const date = new Date();
    switch (Number(query.dateFilter)) {
      case SortDateTypeEnum.Today:
        filterDate = `timestamp=le=${date2}`;
        break;
      case SortDateTypeEnum.YesterDay:
        filterDate = `timestamp=le=${this.formatDate(
          date,
        )} , timestamp=ge=${this.formatDate(
          new Date(date.setDate(date.getDate() - 1)),
        )};`;
        break;
      case SortDateTypeEnum.LastWeek:
        filterDate = `timestamp=le=${this.formatDate(
          date,
        )} , timestamp=ge=${this.formatDate(
          new Date(date.setDate(date.getDate() - 7)),
        )};`;
        break;
      case SortDateTypeEnum.LastMoth:
        filterDate = `timestamp=le=${this.formatDate(
          date,
        )} , timestamp=ge=${this.formatDate(
          new Date(date.setDate(date.getDate() - 30)),
        )};`;
        break;
      case SortDateTypeEnum.MoreThanLastMonth:
        filterDate = `timestamp=le=${date2};`;
        break;
    }
    return filterDate;
  }
}
