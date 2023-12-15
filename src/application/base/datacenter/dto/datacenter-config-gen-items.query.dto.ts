import { BaseQueryDto } from '../../../../infrastructure/dto/base.query.dto';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';

export class DatacenterConfigGenItemsQueryDto extends BaseQueryDto {
  DataCenterId: string;
  GenId: string;
  ServiceTypeId: string;
  ServicePlanType?: ServicePlanTypeEnum;

  constructor(
    DataCenterId: string,
    GenId: string,
    ServiceTypeId: string,
    ServicePlanType?: ServicePlanTypeEnum,
  ) {
    super();
    this.DataCenterId = DataCenterId;
    this.GenId = GenId;
    this.ServiceTypeId = ServiceTypeId;
    this.ServicePlanType = ServicePlanType;
  }
}
