import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { BudgetingService } from '../service/budgeting.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import {
  BudgetingResultDto,
  BudgetingResultDtoFormat,
} from '../dto/results/budgeting.result.dto';
import { IncreaseBudgetCreditDto } from '../dto/increase-budget-credit.dto';
import { WithdrawBudgetCreditToUserCreditDto } from '../dto/withdraw-budget-credit-to-user-credit.dto';
import { ChangeAutoPaidStateDto } from '../dto/change-auto-paid-state.dto';
import { CheckPolicies } from '../../security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../../security/ability/interfaces/policy-handler.interface';
import { Action } from '../../security/ability/enum/action.enum';
import { AclSubjectsEnum } from '../../security/ability/enum/acl-subjects.enum';

@ApiTags('Budget')
@Controller('budgeting')
@ApiBearerAuth()
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Budget, props)),
)
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
    const data: BudgetingResultDtoFormat[] =
      await this.budgetingService.getUserBudgeting(options.user.userId);

    return new BudgetingResultDto().collection(data);
  }

  @Post('increaseBudgetCredit/:serviceInstanceId')
  @ApiOperation({
    summary:
      'increase budget credit for specific service(serviceInstance) from user credit',
  })
  async increaseBudgetCredit(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
    @Body() data: IncreaseBudgetCreditDto,
  ): Promise<boolean> {
    const serviceInstance =
      await this.budgetingService.increaseBudgetingService(
        options.user.userId,
        serviceInstanceId,
        data,
      );

    return serviceInstance;
  }

  @Post('withdrawToUserCredit/:serviceInstanceId')
  @ApiOperation({
    summary: 'withdraw budget credit to user credit',
  })
  async withdrawToUserCredit(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
    @Body() data: WithdrawBudgetCreditToUserCreditDto,
  ): Promise<boolean> {
    const paid = await this.budgetingService.withdrawServiceCreditToUserCredit(
      options.user.userId,
      serviceInstanceId,
      data.amount,
    );

    return paid;
  }

  @Post('changeAutoPaidState/:serviceInstanceId')
  @ApiOperation({
    summary: 'change state auto paid (enable , disable)',
  })
  async changeAutoPaidState(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
    @Body() data: ChangeAutoPaidStateDto,
  ): Promise<BudgetingResultDtoFormat> {
    const result: BudgetingResultDtoFormat =
      await this.budgetingService.changeAutoPaidState(
        serviceInstanceId,
        data.autoPaid,
      );

    return new BudgetingResultDto().toArray(result);
  }
}
