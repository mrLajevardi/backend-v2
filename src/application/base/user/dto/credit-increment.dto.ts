import { IsNumber, Min, IsPositive } from 'class-validator';

export class CreditIncrementDto {
  @IsNumber()
  @Min(1)
  @IsPositive()
  amount: number;
}