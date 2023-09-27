import { InvoiceGroupItem } from './vdc-item-group.interface.dto';

export interface InvoiceItemCost extends InvoiceGroupItem {
  cost: number;
}

export interface TotalInvoiceItemCosts {
  itemsSum: InvoiceItemCost[];
  totalCost: number;
}
