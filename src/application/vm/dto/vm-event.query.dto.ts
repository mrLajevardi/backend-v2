import { BaseQueryDto } from '../../../infrastructure/dto/base.query.dto';

export class VmEventQueryDto extends BaseQueryDto {
  serviceInstanceId: string;
  vappId: string;
  vmId: string;
  dateFilter: string;
  page: number;
  pageSize: number;
}
