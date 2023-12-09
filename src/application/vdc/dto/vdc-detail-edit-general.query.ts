import { BaseQueryDto } from '../../../infrastructure/dto/base.query.dto';

export class VdcDetailEditGeneralQuery extends BaseQueryDto {
  serviceInstanceId: string;
  description: string;
}
