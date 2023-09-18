import { BaseQueryDto } from '../../../../infrastructure/dto/base.query.dto';

export class DatacenterConfigGenItemsQueryDto extends BaseQueryDto {
  DataCenterId: string;
  GenId: string;
  ServiceTypeId: string;
  constructor(DataCenterId: string, GenId: string, ServiceTypeId: string) {
    super();
    this.DataCenterId = DataCenterId;
    this.GenId = GenId;
    this.ServiceTypeId = ServiceTypeId;
  }
}
