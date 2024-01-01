import { BaseQueryDto } from '../../../infrastructure/dto/base.query.dto';

export class VdcItemLimitQueryDto extends BaseQueryDto {
  serviceInstanceId?: string;

  //Cpu Info
  cpuCode?: string;
  cpuUnit?: string;

  //Ram Info
  ramCode?: string;
  ramUnit?: string;

  //Disk Info
  diskCode?: string;
  diskUnit?: string;
}
