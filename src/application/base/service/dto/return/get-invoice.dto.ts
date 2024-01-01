import { InvoiceDiscounts } from 'src/infrastructure/database/entities/InvoiceDiscounts';
import { InvoicePlans } from 'src/infrastructure/database/entities/InvoicePlans';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { InvoiceItemList } from 'src/infrastructure/database/entities/views/invoice-item-list';

export class GetInvoiceReturnDto {
  invoice: Invoices;
  invoiceItemsList: InvoiceItemList[];
  invoiceQuality: InvoicePlans[];
  discount: InvoiceDiscounts;
}
