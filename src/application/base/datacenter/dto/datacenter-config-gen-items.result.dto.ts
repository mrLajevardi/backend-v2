import { ApiProperty } from '@nestjs/swagger';

export class DatacenterConfigGenItemsResultDto {
  @ApiProperty({ type: Number })
  Id: number;

  @ApiProperty({ type: String })
  ItemTypeName: string;

  @ApiProperty({ type: String })
  ServiceTypeName: string;

  @ApiProperty({ type: Number })
  ParentId: number;

  @ApiProperty({ type: Number })
  Price: number;

  @ApiProperty({ type: Number })
  Percent: number;

  @ApiProperty({ type: Number })
  PrincipleType: number;

  @ApiProperty({ type: Number })
  Minimum: number;

  @ApiProperty({ type: Number })
  Maximum: number;

  @ApiProperty({ type: String })
  Unit: string;

  @ApiProperty({ type: [DatacenterConfigGenItemsResultDto] })
  SubItems: DatacenterConfigGenItemsResultDto[] = [];
  constructor(
    Id: number,
    ItemTypeName: string,
    ServiceTypeName: string,
    Price: number,
    Percent: number,
    Minimum: number,
    Maximum: number,
    Unit: string,
    ParentId: number,
  ) {
    this.ItemTypeName = ItemTypeName;
    this.ServiceTypeName = ServiceTypeName;
    this.Price = Price;
    this.Percent = Percent;
    this.Minimum = Minimum;
    this.Maximum = Maximum;
    this.Unit = Unit;
    this.ParentId = ParentId;
    this.Id = Id;
    this.SubItems = [];
  }
}
