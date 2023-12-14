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
import { PaidFromUserCreditDto } from '../dto/paid-from-user-credit.dto';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { ServicePaymentsTableService } from '../../crud/service-payments-table/service-payments-table.service';
import { UserInfoService } from '../../user/service/user-info.service';
import { ServiceChecksService } from '../../service/services/service-checks.service';

@Injectable()
export class BudgetingService {
  constructor(
    private readonly transactionsTableService: TransactionsTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly userTableService: UserTableService,
    private readonly servicePaymentTableService: ServicePaymentsTableService,
    private readonly userInfoService: UserInfoService,
    private readonly serviceChecksService: ServiceChecksService,
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

    const calculateData: Awaited<ServiceInstances>[] = await Promise.all(
      data.map(async (item: ServiceInstances) => {
        item['credit'] = await this.serviceChecksService.getServiceCreditBy(
          item.id,
        );
        return item;
      }),
    );
    console.log(calculateData);

    return calculateData;
  }

  async increaseBudgetingService(
    userId: number,
    serviceInstanceId: string,
    data: IncreaseBudgetCreditDto,
  ) {
    const userCredit: number = await this.userInfoService.getUserCreditBy(
      userId,
    );
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
    metaData?: any[],
  ) {
    const serviceInstance: ServiceInstances =
      await this.serviceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
      });

    const serviceInstanceCredit: number =
      await this.serviceChecksService.getServiceCreditBy(serviceInstanceId);

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
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
    });

    return true;
  }

  async paidFromUserCredit(
    userId: number,
    serviceInstanceId: string,
    data: PaidFromUserCreditDto,
    metaData?: any[],
  ): Promise<boolean> {
    const user: User = await this.userTableService.findById(userId);
    const userCredit = await this.userInfoService.getUserCreditBy(userId);

    if (isNil(user)) {
      throw new NotFoundException();
    }

    if (userCredit == 0 || data.paidAmount > userCredit) {
      throw new NotEnoughCreditException();
    }

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

    await this.transactionsTableService.create(transactionDto);

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      paymentType: PaymentTypes.PayToServiceByUserCredit,
      price: data.paidAmount,
    });

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      paymentType: PaymentTypes.PayToServiceByUserCredit,
      price: -data.paidAmount,
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
    });

    return true;
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
    const serviceInstanceCredit: number =
      await this.serviceChecksService.getServiceCreditBy(serviceInstanceId);
    if (isNil(serviceInstance)) {
      throw new NotFoundException();
    }
    if (serviceInstanceCredit == 0 || amount > serviceInstanceCredit) {
      throw new NotEnoughCreditException();
    }

    const user: User = await this.userTableService.findById(userId);

    if (isNil(user)) {
      throw new NotFoundException();
    }

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      paymentType: PaymentTypes.PayToUserCreditByBudgeting,
      price: -amount,
    });

    await this.transactionsTableService.create({
      userId: userId.toString(),
      serviceInstanceId: serviceInstanceId,
      dateTime: new Date(),
      value: amount,
      paymentType: PaymentTypes.PayToUserCreditByBudgeting,
      isApproved: true,
    });

    return true;
  }
}
