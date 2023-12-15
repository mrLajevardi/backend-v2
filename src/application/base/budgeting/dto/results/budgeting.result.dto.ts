import { ServiceInstances } from '../../../../../infrastructure/database/entities/ServiceInstances';

export class BudgetingResultDtoFormat {
  id: string;
  serviceType: string | null | undefined;
  name: string;
  credit: number;
}

export class BudgetingResultDto {
  collection(data: ServiceInstances[]): BudgetingResultDtoFormat[] {
    return data.map((item: ServiceInstances) => {
      return this.toArray(item);
    });
  }

  toArray(item: ServiceInstances): BudgetingResultDtoFormat {
    return {
      id: item.id,
      serviceType: item.serviceTypeId,
      name: item.name,
      credit: item.credit,
    };
  }
}
