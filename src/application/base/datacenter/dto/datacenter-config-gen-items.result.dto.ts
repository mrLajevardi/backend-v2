import { ApiProperty } from '@nestjs/swagger';

export class DatacenterConfigGenItemsResultDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  itemTypeName: string;

  @ApiProperty({ type: String })
  itemTypeCode: string;

  @ApiProperty({ type: String })
  serviceTypeName: string;

  @ApiProperty({ type: Number })
  parentId: number;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: Number })
  percent: number;

  @ApiProperty({ type: Number })
  principleType: number;

  @ApiProperty({ type: Number })
  minimum: number;

  @ApiProperty({ type: Number })
  maximum: number;

  @ApiProperty({ type: String })
  unit: string;

  @ApiProperty({ type: Number })
  step: number;

  @ApiProperty({ type: Boolean })
  enabled: boolean;

  @ApiProperty({ type: Boolean })
  isHidden: boolean;

  @ApiProperty({ type: [DatacenterConfigGenItemsResultDto] })
  subItems: DatacenterConfigGenItemsResultDto[] = [];
  constructor(
    Id: number,
    ItemTypeName: string,
    ItemTypeCode: string,
    ServiceTypeName: string,
    Price: number,
    Percent: number,
    Minimum: number,
    Maximum: number,
    Unit: string,
    ParentId: number,
    Step: number,
    Enabled: boolean,
    IsHidden: boolean,
  ) {
    this.itemTypeName = ItemTypeName;
    this.itemTypeCode = ItemTypeCode;
    this.serviceTypeName = ServiceTypeName;
    this.price = Price;
    this.percent = Percent;
    this.minimum = Minimum;
    this.maximum = Maximum;
    this.unit = Unit;
    this.parentId = ParentId;
    this.id = Id;
    this.subItems = [];
    this.step = Step;
    this.enabled = Enabled;
    this.isHidden = IsHidden;
  }
}
