import { InvoiceItemsDto } from './create-service-invoice.dto';

export class CreatedServicePlansAndItemsDto {
  items: InvoiceItemsDto[];
  plans: string[];
  duration: number;
}
