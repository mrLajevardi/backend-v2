import { InvoiceItemsDto } from '../dto/create-service-invoice.dto';

export class MappedItemTypes {
  itemTypeIds: number[];
  ItemTypesById: ItemTypesById;

  constructor() {
    this.itemTypeIds = [];
    this.ItemTypesById = {};
  }
}

interface ItemTypesById {
  [key: string]: InvoiceItemsDto;
}
