import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class WithdrawBudgetCreditToUserCreditDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  amount: number;
}
