import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaidFromUserCreditDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  paidAmount: number;
}
