import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsNumber()
  invoiceId: number;
}
