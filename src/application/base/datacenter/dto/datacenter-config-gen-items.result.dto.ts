import { DatacenterConfigGenItemsStepsResultDto } from './datacenter-config-gen-items-steps.result.dto';
import { faker } from '@faker-js/faker';

export class DatacenterConfigGenItemsResultDto {
  ItemTypeName: string;
  Price: number;
  Percent: number;
  // PrincipleType: number;
  Minimum: number;
  Maximum: number;
  Unit: string;
  SubItems: DatacenterConfigGenItemsStepsResultDto[];
  constructor(
    ItemTypeName: string,
    Price: number,
    Percent: number,
    Minimum: number,
    Maximum: number,
    Unit: string,
    SubItems: DatacenterConfigGenItemsStepsResultDto[],
  ) {
    this.ItemTypeName = ItemTypeName;
    this.Price = Price;
    this.Percent = Percent;
    this.Minimum = Minimum;
    this.Maximum = Maximum;
    this.Unit = Unit;
    this.SubItems = SubItems;
  }

  static GenerateDatacenterConfigGenItemsResultDtoMock(): DatacenterConfigGenItemsResultDto[] {
    const res: DatacenterConfigGenItemsResultDto[] = [];
    const steps: DatacenterConfigGenItemsStepsResultDto[] = [];
    const count = 5;
    const countSteps = 6;

    for (let i = 0; i < countSteps; i++) {
      steps.push(
        new DatacenterConfigGenItemsStepsResultDto(
          faker.string.alpha(2),

          faker.number.int({ min: 10000, max: 35000 }),

          faker.number.int({ min: 10, max: 80 }),

          faker.number.int({ min: 1, max: 4 }),

          faker.number.int({ min: 10, max: 100 }),

          faker.number.int({ min: 10, max: 100 }),

          '',
        ),
      );
    }

    for (let i = 0; i < count; i++) {
      res.push(
        new DatacenterConfigGenItemsResultDto(
          faker.string.alpha(6),
          faker.number.int({ min: 10000, max: 35000 }),
          faker.number.int({ min: 10, max: 80 }),
          faker.number.int({ min: 10, max: 100 }),
          faker.number.int({ min: 10, max: 100 }),
          'GB',
          steps,
        ),
      );
    }
    return res;
  }
}
