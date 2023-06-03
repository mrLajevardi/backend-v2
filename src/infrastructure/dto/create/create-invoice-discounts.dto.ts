import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDiscountsDto {
  @IsInt()
  @ApiProperty()
  invoiceId: number;

  @IsInt()
  @ApiProperty()
  discountId: number;
}
