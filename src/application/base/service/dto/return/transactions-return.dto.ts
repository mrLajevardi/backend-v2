import { Transactions } from 'src/infrastructure/database/entities/Transactions';

export class TransactionsReturnDto {
  id?: string;
  dateTime: Date;
  value: number;
  invoiceId?: number | null;
  description?: string | null;
  paymentType: number;
  paymentToken?: string | null;
  isApproved: boolean;
  serviceInstanceId: string | null;
  userId: number;

  user?: {
    name: string;
    family: string;
    active: boolean;
  };
}
