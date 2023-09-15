import { DatacenterConfigGenItemsStepsResultDto } from './datacenter-config-gen-items-steps.result.dto';
import { faker } from '@faker-js/faker';

export class DatacenterConfigGenItemsResultDto {
  Id: number;
  ItemTypeName: string;
  ParentId: number;
  Price: number;
  Percent: number;
  PrincipleType: number;
  Minimum: number;
  Maximum: number;
  Unit: string;
  SubItems: DatacenterConfigGenItemsResultDto[] = [];
  constructor(
    Id: number,
    ItemTypeName: string,
    Price: number,
    Percent: number,
    Minimum: number,
    Maximum: number,
    Unit: string,
    // SubItems: DatacenterConfigGenItemsStepsResultDto[],
    ParentId: number,
  ) {
    this.ItemTypeName = ItemTypeName;
    this.Price = Price;
    this.Percent = Percent;
    this.Minimum = Minimum;
    this.Maximum = Maximum;
    this.Unit = Unit;
    this.ParentId = ParentId;
    this.Id = Id;
    this.SubItems = [];
    // this.SubItems = SubItems;
  }

  // static GenerateDatacenterConfigGenItemsResultDtoMock(): DatacenterConfigGenItemsResultDto[] {
  //   const stepsReservation: DatacenterConfigGenItemsStepsResultDto[]=[];
  //   stepsReservation.push(
  //     new DatacenterConfigGenItemsStepsResultDto('5', 1, 0.05, 2, 0, 0, ''),
  //   );
  //   stepsReservation.push(
  //     new DatacenterConfigGenItemsStepsResultDto('25', 1, 0.25, 2, 0, 0, ''),
  //   );
  //   stepsReservation.push(
  //     new DatacenterConfigGenItemsStepsResultDto('50', 1, 0.5, 2, 0, 0, ''),
  //   );
  //   stepsReservation.push(
  //     new DatacenterConfigGenItemsStepsResultDto('75', 1, 0.75, 2, 0, 0, ''),
  //   );
  //   stepsReservation.push(
  //     new DatacenterConfigGenItemsStepsResultDto('100', 1, 1, 2, 0, 0, ''),
  //   );
  //
  //   const stepsGaranty: DatacenterConfigGenItemsStepsResultDto[]=[];
  //   stepsGaranty.push(
  //     new DatacenterConfigGenItemsStepsResultDto('1', 0, 0, 1, 0, 0, ''),
  //   );
  //   stepsGaranty.push(
  //     new DatacenterConfigGenItemsStepsResultDto('3', 25000, 0, 1, 0, 0, ''),
  //   );
  //   stepsGaranty.push(
  //     new DatacenterConfigGenItemsStepsResultDto('6', 30000, 0, 1, 0, 0, ''),
  //   );
  //
  //   const stepsPeriods: DatacenterConfigGenItemsStepsResultDto[]=[];
  //   stepsPeriods.push(
  //       new DatacenterConfigGenItemsStepsResultDto('1', 0, 0, 1, 0, 0, ''),
  //   );
  //   stepsPeriods.push(
  //       new DatacenterConfigGenItemsStepsResultDto('3', 0, -0.05, 1, 0, 0, ''),
  //   );
  //   stepsPeriods.push(
  //       new DatacenterConfigGenItemsStepsResultDto('6', 0, -0.1, 1, 0, 0, ''),
  //   );
  //
  //   const ItemsConfig: string[] = [
  //     'RAM',
  //     'CPU',
  //     'DISK',
  //     'RESERVATION',
  //     'GARANTY',
  //     'PERIOD',
  //   ];
  //   const ItemsSteps: string[] = ['LO', 'L1', 'L2', 'L3'];
  //   const res: DatacenterConfigGenItemsResultDto[] = [];
  //   const steps: DatacenterConfigGenItemsStepsResultDto[] = [];
  //   const count = 6;
  //   const countSteps = 4;
  //   for (let i = 0; i < countSteps; i++) {
  //     steps.push(
  //       new DatacenterConfigGenItemsStepsResultDto(
  //         ItemsSteps[i],
  //
  //         0,// faker.number.int({ min: 10000, max: 35000 }),
  //
  //         faker.number.float({ min: 1, max: 1.5 }),
  //
  //         1, // faker.number.int({ min: 1, max: 4 }),
  //
  //         faker.number.int({ min: 10, max: 100 }),
  //
  //         faker.number.int({ min: 10, max: 100 }),
  //
  //         '{Min:0,Max:0}',
  //       ),
  //     );
  //   }
  //   for (let i = 0; i < count; i++) {
  //     const itemConfig = new DatacenterConfigGenItemsResultDto(
  //       ItemsConfig[i],
  //       faker.number.int({ min: 10000, max: 35000 }),
  //       0, // faker.number.int({ min: 10, max: 80 }),
  //       0, // faker.number.int({ min: 10, max: 100 }),
  //       0, // faker.number.int({ min: 10, max: 100 }),
  //       'GB',
  //       steps,
  //     );
  //     const stepNew: DatacenterConfigGenItemsStepsResultDto =
  //       new DatacenterConfigGenItemsStepsResultDto('5', 0, 0, 0, 0, 0, '');
  //     const stepNew2: DatacenterConfigGenItemsStepsResultDto =
  //       new DatacenterConfigGenItemsStepsResultDto('25', 0, 0, 0, 0, 0, '');
  //     const stepNew3: DatacenterConfigGenItemsStepsResultDto =
  //       new DatacenterConfigGenItemsStepsResultDto('75', 0, 0, 0, 0, 0, '');
  //     switch (i) {
  //       case 1:
  //         itemConfig.Unit = 'Core';
  //         break;
  //
  //       case 3:
  //         itemConfig.Unit = '%';
  //         itemConfig.SubItems = stepsReservation;
  //         break;
  //       case 4:
  //         itemConfig.Unit = 'Month';
  //         itemConfig.SubItems = stepsGaranty;
  //         break;
  //
  //       case 5:
  //         itemConfig.Unit = 'Month';
  //         itemConfig.SubItems = stepsPeriods;
  //         break;
  //     }
  //
  //     // var steps = steps;
  //
  //     res.push(itemConfig);
  //   }
  //
  //   return res;
  // }
}
