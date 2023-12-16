import { VServiceInstances } from '../../../../../infrastructure/database/entities/views/v-serviceInstances';

export class BudgetingResultDtoFormat {
  id: string;
  serviceType: string | null | undefined;
  name: string;
  credit: number;
}

export class BudgetingResultDto {
  collection(data: VServiceInstances[]): BudgetingResultDtoFormat[] {
    return data.map((item: VServiceInstances) => {
      return this.toArray(item);
    });
  }

  toArray(item: VServiceInstances): BudgetingResultDtoFormat {
    return {
      id: item.id,
      serviceType: item.serviceTypeId,
      name: item.name,
      credit: item.credit,
    };
  }
}
