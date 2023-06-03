import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInvoicePropertiesDto {
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
