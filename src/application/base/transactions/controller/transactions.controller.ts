import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsService } from '../transactions.service';
import { TransactionsResultDto } from '../dto/results/transactions.result.dto';
import { ChangeUserCreditDto } from '../dto/change-user-credit.dto';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/changeUserCredit/:userId')
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'userId about a specify user',
  })
  async changeUserCredit(
    @Param('userId') userId: number,
    @Body() dto: ChangeUserCreditDto,
  ) {
    const data = await this.transactionsService.changeUserCredit(userId, dto);

    return new TransactionsResultDto().toArray(data);
  }
}
