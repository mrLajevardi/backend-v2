import { ServicePlanTypeEnum } from 'src/application/base/service/enum/service-plan-type.enum';
import { Invoices } from '../../../../../infrastructure/database/entities/Invoices';
import { ServiceInstances } from '../../../../../infrastructure/database/entities/ServiceInstances';
import { BaseResultDto } from '../../../../../infrastructure/dto/base.result.dto';
import { isNil } from 'lodash';
import { ServiceTypesEnum } from 'src/application/base/service/enum/service-types.enum';

export class PhoneNumberHashResultDto extends BaseResultDto {
  phoneNumber: string

  hash: string
}
