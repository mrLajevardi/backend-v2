import { IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoicePlansDto {
  @IsInt()
  @ApiProperty()
  invoiceId: number;

  @IsString()
  @ApiProperty()
  planCode: string;

  @IsNumber()
  @ApiProperty()
  ratio: number;

  @IsNumber()
  @ApiProperty()
  amount: number;
}
