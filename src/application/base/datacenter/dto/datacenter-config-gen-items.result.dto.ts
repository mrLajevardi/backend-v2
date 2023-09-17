
export class DatacenterConfigGenItemsResultDto {
  Id: number;
  ItemTypeName: string;
  ServiceTypeName: string;
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
