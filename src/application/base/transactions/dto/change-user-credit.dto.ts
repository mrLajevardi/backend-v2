import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { TransactionAmountTypeEnum } from '../enum/transaction-amount-type.enum';

export class ChangeUserCreditDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsEnum(TransactionAmountTypeEnum)
  @IsNumber()
  transactionType: TransactionAmountTypeEnum;
}
