import { CreatePlansDto } from '../../crud/plans-table/dto/create-plans.dto';

export class CreateInvoicePlansPluralDto {
  invoiceId: number;
  plans: CreatePlansDto[];
}
