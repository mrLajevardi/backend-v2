import { ServiceDiscount } from 'src/infrastructure/database/entities/ServiceDiscount';
import { InvoiceGroupItem } from './vdc-item-group.interface.dto';

export interface InvoiceItemCost extends InvoiceGroupItem {
  cost?: number;
}

export interface TotalInvoiceItemCosts {
  itemsSum: InvoiceItemCost[];
  itemsTotalCosts: number;
  totalCost: number;
  serviceCost: number;
  templateDiscount?: ServiceDiscount;
}
