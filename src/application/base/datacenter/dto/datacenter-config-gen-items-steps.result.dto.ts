import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';

export class DatacenterConfigGenItemsStepsResultDto extends BaseResultDto {
  ItemTypeName: string;
  Price: number;
  Percent: number;
  PrincipleType: number;
  Minimum: number;
  Maximum: number;
  // Coefficient: number;
  Rulls: string; // Can Be a Costume Json to Specify Others Setting like ==> Min , Max , Range
  constructor(
    ItemTypeName: string,
    Price: number,
    Percent: number,
    PrincipleType: number,
    Minimum: number,
    Maximum: number,
    // Coefficient: number,
    Rulls: string,
  ) {
    super();
    this.ItemTypeName = ItemTypeName;
    this.Price = Price;
    this.Percent = Percent;
    this.ItemTypeName = ItemTypeName;
    this.PrincipleType = PrincipleType;
    this.Minimum = Minimum;
    this.Maximum = Maximum;
    this.Rulls = Rulls;
  }
}
