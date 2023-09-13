import { BaseQueryDto } from '../../../../infrastructure/dto/base.query.dto';

export class DatacenterConfigGenItemsQueryDto extends BaseQueryDto {
  DataCenterId: string;
  GenId: string;
  constructor(DataCenterId: string, GenId: string) {
    super();
    this.DataCenterId = DataCenterId;
    this.GenId = GenId;
  }
}
