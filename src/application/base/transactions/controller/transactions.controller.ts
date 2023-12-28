import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../transactions.service';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  // constructor(
  //     private readonly transactionsService: TransactionsService
  // ) {
  // }
  // @Get('getOwnUser')
  // @ApiOperation({
  //     summary: 'get authenticate user all transactions'
  // })
  // async getOwnUser(){
  //     // const data = await t
  // }
}
