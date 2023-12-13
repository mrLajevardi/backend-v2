import { Injectable } from '@nestjs/common';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceInstances } from '../../../../infrastructure/database/entities/ServiceInstances';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { IncreaseBudgetCreditDto } from '../dto/increase-budget-credit.dto';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { User } from '../../../../infrastructure/database/entities/User';
import { NotEnoughCreditException } from '../../../../infrastructure/exceptions/not-enough-credit.exception';
import { CreateTransactionsDto } from '../../crud/transactions-table/dto/create-transactions.dto';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { PaidFromBudgetCreditDto } from '../dto/paid-from-budget-credit.dto';
import { isNil } from 'lodash';
import { NotFoundException } from '../../../../infrastructure/exceptions/not-found.exception';
import { Transactions } from '../../../../infrastructure/database/entities/Transactions';
import { PaidFromUserCreditDto } from '../dto/paid-from-user-credit.dto';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { ServicePaymentsTableService } from '../../crud/service-payments-table/service-payments-table.service';

@Injectable()
export class BudgetingService {
  constructor(
    private readonly transactionsTableService: TransactionsTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly userTableService: UserTableService,
    private readonly servicePaymentTableService: ServicePaymentsTableService,
  ) {}

  async getUserBudgeting(userId: number): Promise<ServiceInstances[]> {
    const data: ServiceInstances[] =
      await this.serviceInstancesTableService.find({
        where: {
          userId: userId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
      });

    return data;
  }

  async increaseBudgetingService(
    userId: number,
    serviceInstanceId: string,
    data: IncreaseBudgetCreditDto,
  ) {
    const user: User = await this.userTableService.findById(userId);
    const userCredit = user.credit;
    const serviceInstance: ServiceInstances =
      await this.serviceInstancesTableService.findById(serviceInstanceId);

    if (serviceInstance.userId != userId) {
      throw new BadRequestException();
    }

    if (userCredit < data.increaseAmount) {
      throw new NotEnoughCreditException();
    }

    await this.transactionsTableService.create({
      serviceInstanceId: serviceInstanceId,
      userId: userId.toString(),
      isApproved: true,
      dateTime: new Date(),
      value: -data.increaseAmount,
      paymentType: PaymentTypes.PayToBudgetingByUserCredit,
    });

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      price: data.increaseAmount,
      paymentType: PaymentTypes.PayToBudgetingByUserCredit,
    });

    return true;
  }

  async paidFromBudgetCredit(
    serviceInstanceId: string,
    data: PaidFromBudgetCreditDto,
  ) {
    const serviceInstance: ServiceInstances =
      await this.serviceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
      });

    const serviceInstanceCredit = serviceInstance.credit;

    if (isNil(serviceInstance)) {
      throw new NotFoundException();
    }

    /*
              consider if budgeting can pay from user credit,must be call paidFromUserCredit method
             */

    if (serviceInstanceCredit == 0 || data.paidAmount > serviceInstanceCredit) {
      throw new NotEnoughCreditException();
    }

    const servicePayment = await this.servicePaymentTableService.create({
      userId: serviceInstance.userId,
      serviceInstanceId: serviceInstanceId,
      price: -data.paidAmount,
      paymentType: PaymentTypes.PayToServiceByBudgeting,
    });

    return true;
  }

  async paidFromUserCredit(
    userId: number,
    serviceInstanceId: string,
    data: PaidFromUserCreditDto,
  ): Promise<Transactions> {
    const user: User = await this.userTableService.findById(userId);
    const userCredit = user.credit;

    if (isNil(user)) {
      throw new NotFoundException();
    }

    if (userCredit == 0 || data.paidAmount > userCredit) {
      throw new NotEnoughCreditException();
    }

    const afterUserCredit = userCredit - data.paidAmount;

    const transactionDto: CreateTransactionsDto = {
      userId: userId.toString(),
      dateTime: new Date(),
      value: -data.paidAmount,
      paymentType: PaymentTypes.PayToServiceByUserCredit,
      description: '',
      serviceInstanceId: serviceInstanceId,
      invoiceId: null,
      paymentToken: null,
      isApproved: true,
    };

    const transaction: Transactions =
      await this.transactionsTableService.create(transactionDto);

    await this.userTableService.update(userId, {
      credit: afterUserCredit,
    });

    return transaction;
  }

  async withdrawServiceCreditToUserCredit(
    userId: number,
    serviceInstanceId: string,
    amount: number,
  ) {
    const serviceInstance: ServiceInstances =
      await this.serviceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
      });
    if (isNil(serviceInstance)) {
      throw new NotFoundException();
    }
    if (serviceInstance.credit == 0 || amount > serviceInstance.credit) {
      throw new NotEnoughCreditException();
    }

    const user: User = await this.userTableService.findById(userId);

    if (isNil(user)) {
      throw new NotFoundException();
    }

    const afterServiceInstanceCredit = serviceInstance.credit - amount;

    const afterUserCredit = user.credit + amount;

    const transactionDto: CreateTransactionsDto = {
      userId: userId.toString(),
      serviceInstanceId: serviceInstanceId,
      dateTime: new Date(),
      value: amount,
      paymentType: PaymentTypes.PayToUserCreditByBudgeting,
      description: '',
      invoiceId: null,
      paymentToken: null,
      isApproved: true,
    };

    const transaction: Transactions =
      await this.transactionsTableService.create(transactionDto);

    await this.userTableService.update(userId, {
      credit: afterUserCredit,
    });

    await this.serviceInstancesTableService.update(serviceInstanceId, {
      credit: afterServiceInstanceCredit,
    });

    return transaction;
  }
}
