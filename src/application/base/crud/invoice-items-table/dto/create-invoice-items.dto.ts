import { IsInt, IsNumber, IsString } from 'class-validator';
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

  @IsString()
  @ApiProperty({ type: String })
  value?: string;

  @IsString()
  @ApiProperty({ type: String })
  codeHierarchy?: string;

  @IsInt()
  @ApiProperty()
  itemId: number;
}
