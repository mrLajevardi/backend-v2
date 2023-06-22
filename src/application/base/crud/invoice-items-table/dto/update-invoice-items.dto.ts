import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoiceItemsDto {
  @IsInt()
  @ApiProperty()
  invoiceId?: number;

  @IsNumber()
  @ApiProperty()
  quantity?: number;

  @IsNumber()
  @ApiProperty()
  fee?: number;

  @IsInt()
  @ApiProperty()
  itemId?: number;
}
