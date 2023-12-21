import { VServiceInstances } from '../../../../../infrastructure/database/entities/views/v-serviceInstances';
import { BaseResultDto } from '../../../../../infrastructure/dto/base.result.dto';

export class BudgetingResultDtoFormat {
  id: string;
  name: string;
  credit: number;
  perHour: number;
  hoursLeft: number;
  serviceType: string | null | undefined;
}

export class BudgetingResultDto extends BaseResultDto {
  collection(data: BudgetingResultDtoFormat[]): BudgetingResultDtoFormat[] {
    return data.map((item: BudgetingResultDtoFormat) => {
      return this.toArray(item);
    });
  }

  toArray(item: BudgetingResultDtoFormat): BudgetingResultDtoFormat {
    return {
      id: item.id,
      name: item.name,
      credit: item.credit,
      perHour: item.perHour,
      hoursLeft: Number(item.credit) / item.perHour,
      serviceType: item.serviceType,
    };
  }
}
