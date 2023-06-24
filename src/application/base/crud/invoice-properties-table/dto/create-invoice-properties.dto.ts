import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoicePropertiesDto {
  @IsInt()
  @ApiProperty()
  invoiceId: number;

  @IsString()
  @ApiProperty()
  propertyKey: string;

  @IsString()
  @ApiProperty({ required: false })
  value: string | null;
}
