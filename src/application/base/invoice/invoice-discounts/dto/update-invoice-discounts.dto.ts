import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoiceDiscountsDto {
  @IsInt()
  @ApiProperty()
  invoiceId?: number;

  @IsInt()
  @ApiProperty()
  discountId?: number;
}
