import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceItemsDto {
  @IsInt()
  @ApiProperty()
  invoiceId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @ApiProperty()
  fee: number;

  value?: string;

  @IsInt()
  @ApiProperty()
  itemId: number;
}
