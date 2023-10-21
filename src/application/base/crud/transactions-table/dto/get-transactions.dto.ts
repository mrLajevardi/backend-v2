import { ApiProperty } from '@nestjs/swagger';
import { PaymentTypes } from '../enum/payment-types.enum';

export class getTransactionsDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  dateTime: Date;

  @ApiProperty({ type: Number })
  value: number;

  @ApiProperty({ type: Number })
  invoiceId: number;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: PaymentTypes, enum: PaymentTypes })
  PaymentType: PaymentTypes;

  @ApiProperty({ type: String })
  paymentToken: string;

  @ApiProperty({ type: Boolean })
  isApproved: boolean;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: String })
  serviceInstanceId: string;
}
