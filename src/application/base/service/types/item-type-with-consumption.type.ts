import { ItemTypes } from "src/infrastructure/database/entities/ItemTypes";

export class ItemTypeWithConsumption extends ItemTypes {
  consumption: number;
}
