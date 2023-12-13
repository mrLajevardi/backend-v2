import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { BudgetingService } from '../service/budgeting.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { ServiceInstances } from '../../../../infrastructure/database/entities/ServiceInstances';
import {
  BudgetingResultDto,
  BudgetingResultDtoFormat,
} from '../dto/results/budgeting.result.dto';
import { IncreaseBudgetCreditDto } from '../dto/increase-budget-credit.dto';
import { WithdrawBudgetCreditToUserCreditDto } from '../dto/withdraw-budget-credit-to-user-credit.dto';
import { Transactions } from '../../../../infrastructure/database/entities/Transactions';
import { TransactionsReturnDto } from '../../service/dto/return/transactions-return.dto';
import { isNil } from 'lodash';

@ApiTags('Budget')
@Controller('budgeting')
@ApiBearerAuth()
export class BudgetingController {
  constructor(private readonly budgetingService: BudgetingService) {}

  @Get('getUser')
  @ApiOperation({
    summary:
      'get current user pay as you go service instance and have budgeting',
  })
  async getUserBudget(
    @Request() options: SessionRequest,
  ): Promise<BudgetingResultDtoFormat[]> {
    const data: ServiceInstances[] =
      await this.budgetingService.getUserBudgeting(options.user.userId);

    return new BudgetingResultDto().collection(data);
  }

  @Post('increaseBudgetCredit/:serviceInstanceId')
  // @ApiParam({
  //   name: 'serviceInstancesId',
  //   type: String,
  //   description: 'serviceInstanceId about a specify serviceInstance',
  // })
  @ApiOperation({
    summary:
      'increase budget credit for specific service(serviceInstance) from user credit',
  })
  async increaseBudgetCredit(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
    @Body() data: IncreaseBudgetCreditDto,
  ): Promise<any> {
    const serviceInstance =
      await this.budgetingService.increaseBudgetingService(
        options.user.userId,
        serviceInstanceId,
        data,
      );
    return true;
    // return new BudgetingResultDto().toArray(serviceInstance);
  }

  @Post('withdrawToUserCredit/:serviceInstanceId')
  // @ApiParam({
  //   name: 'serviceInstancesId',
  //   type: String,
  //   description: 'serviceInstanceId about a specify serviceInstance',
  // })
  @ApiOperation({
    summary: 'withdraw budget credit to user credit',
  })
  async withdrawToUserCredit(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
    @Body() data: WithdrawBudgetCreditToUserCreditDto,
  ) {
    const transaction: Transactions =
      await this.budgetingService.withdrawServiceCreditToUserCredit(
        options.user.userId,
        serviceInstanceId,
        data.amount,
      );

    // const response: TransactionsReturnDto = {
    //   id: transaction.id ,
    //   userId: transaction.userId ,
    //   serviceInstanceId: transaction.serviceInstanceId,
    //   value: transaction.value ,
    //   paymentType: transaction.paymentType ,
    //   dateTime: transaction.dateTime ,
    //   isApproved: transaction.isApproved ,
    // }
    //
    // return response;
    return !isNil(transaction.id);
  }
}
