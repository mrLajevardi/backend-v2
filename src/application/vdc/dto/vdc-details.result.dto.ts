import { VdcInvoiceDetailsResultDto } from './vdc-invoice-details.result.dto';
import { ServicePlanTypeEnum } from '../../base/service/enum/service-plan-type.enum';

export class VdcDetailsResultDto extends VdcInvoiceDetailsResultDto {
  constructor() {
    super();
  }

  servicePlanType?: ServicePlanTypeEnum;
  daysLeft?: number;
  serviceName?: string;
  status?: number;
  serviceCredit?: number;
  extendable?: boolean;
}
