import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';

export class VmEventValuesDto {
  status: boolean;
  type: string;
  performingUser: string;
  date: Date;
}
export class VmEventResultDto extends BaseResultDto {
  values: VmEventValuesDto[];
  totalNumber: number;
  pageSize: number;
  pageNumber: number;
  pageCountTotal: number;
}
