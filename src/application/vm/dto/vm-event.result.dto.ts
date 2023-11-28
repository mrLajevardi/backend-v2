import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';

export class VmEventValuesDto {
  status: boolean;
  type: string;
  performingUser: string;
  date: Date;
  description: string;
  operationType: string;
}
export class VmEventResultDto extends BaseResultDto {
  values: VmEventValuesDto[];
  totalNumber: number;
  pageSize: number;
  pageNumber: number;
  pageCountTotal: number;
}
