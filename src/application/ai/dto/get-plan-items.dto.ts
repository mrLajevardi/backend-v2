export interface ServiceItemDto {
  ID: number;
  ServiceTypeID: string;
  Title: string;
  Unit: string;
  Fee: number;
  Code: string;
  MaxAvailable: number;
  MaxPerRequest: number;
  MinPerRequest: number | null;
  AddressDemo: string;
}

export interface GetPlanItemsDto {
  Code: string;
  AdditionRatio: number;
  Description: string;
  Condition: string;
  AdditionAmount: number;
  CostPerRequest: number;
  Items: ServiceItemDto[];
}
