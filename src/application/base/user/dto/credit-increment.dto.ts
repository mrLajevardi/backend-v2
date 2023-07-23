import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsPositive } from 'class-validator';

export class CreditIncrementDto {
  @IsNumber()
  @Min(1)
  @IsPositive()
  @ApiProperty()
  amount: number;
}
