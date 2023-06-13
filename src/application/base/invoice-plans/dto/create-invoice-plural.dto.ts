import { IsInt } from 'class-validator';
import { InvoicePlans } from 'src/infrastructure/database/test-entities/InvoicePlans';

export class CreateInvoicePluralDto {
  plans: InvoicePlans[];

  @IsInt()
  invoiceId: number;
}
