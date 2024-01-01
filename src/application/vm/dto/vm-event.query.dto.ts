import { BaseQueryDto } from '../../../infrastructure/dto/base.query.dto';
import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';

export class VmEventQueryDto extends BaseQueryDto {
  serviceInstanceId: string;
  vappId: string;
  vmId: string;
  dateFilter: SortDateTypeEnum;
  page = 1;
  pageSize = 10;
  dateBegin?: Date;
  dateEnd?: Date;
}
