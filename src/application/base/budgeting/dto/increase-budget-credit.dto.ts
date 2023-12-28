import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class IncreaseBudgetCreditDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  increaseAmount: number;
}
