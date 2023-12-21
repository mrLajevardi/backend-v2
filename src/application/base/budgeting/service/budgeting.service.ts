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
import { isNil, toInteger } from 'lodash';
import { NotFoundException } from '../../../../infrastructure/exceptions/not-found.exception';
import { PaidFromUserCreditDto } from '../dto/paid-from-user-credit.dto';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';
import { ServicePaymentsTableService } from '../../crud/service-payments-table/service-payments-table.service';
import { UserInfoService } from '../../user/service/user-info.service';
import { ServiceChecksService } from '../../service/services/service-checks.service';
import { VServiceInstancesTableService } from '../../crud/v-service-instances-table/v-service-instances-table.service';
import { VServiceInstances } from '../../../../infrastructure/database/entities/views/v-serviceInstances';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { PaygCostCalculationService } from '../../invoice/service/payg-cost-calculation.service';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { InvoiceItemsDto } from '../../invoice/dto/create-service-invoice.dto';
import { VdcFactoryService } from '../../../vdc/service/vdc.factory.service';
import { TotalInvoiceItemCosts } from '../../invoice/interface/invoice-item-cost.interface';
import { BudgetingResultDtoFormat } from '../dto/results/budgeting.result.dto';

@Injectable()
export class BudgetingService {
  constructor(
    private readonly transactionsTableService: TransactionsTableService,
    private readonly userTableService: UserTableService,
    private readonly servicePaymentTableService: ServicePaymentsTableService,
    private readonly userInfoService: UserInfoService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
    private readonly systemSettingsTableService: SystemSettingsTableService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly vdcFactoryService: VdcFactoryService,
  ) {}

  async getUserBudgeting(userId: number): Promise<BudgetingResultDtoFormat[]> {
    const vServiceInstances: VServiceInstances[] =
      await this.vServiceInstancesTableService.find({
        where: {
          userId: userId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
        relations: ['serviceItems'],
      });

    const data: BudgetingResultDtoFormat[] = await Promise.all(
      vServiceInstances.map(
        async (item: VServiceInstances): Promise<BudgetingResultDtoFormat> => {
          const perHour: number = await this.calculateCostPerHour(
            item.serviceItems,
          );
          const hoursLeft: number = Number(item.credit) / perHour;

          return {
            id: item.id,
            name: item.name,
            credit: item.credit,
            perHour: perHour,
            hoursLeft: hoursLeft,
            serviceType: item.serviceTypeId,
          } as BudgetingResultDtoFormat;
        },
      ),
    );

    return data;
  }

  async increaseBudgetingService(
    userId: number,
    serviceInstanceId: string,
    data: IncreaseBudgetCreditDto,
  ) {
    const userCredit: number = await this.userInfoService.getUserCreditBy(
      userId,
    );
    const serviceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findById(serviceInstanceId);

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
  ): Promise<boolean> {
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: {
        propertyKey: 'TaxPercent',
      },
    });

    const vServiceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findById(serviceInstanceId);
    if (isNil(vServiceInstance)) {
      throw new NotFoundException();
    }

    /*
              consider if budgeting can pay from user credit,must be call paidFromUserCredit method
             */

    if (
      vServiceInstance.credit == 0 ||
      data.paidAmount > vServiceInstance.credit
    ) {
      throw new NotEnoughCreditException();
    }
    const priceWithTax: number =
      data.paidAmount * (1 + Number(taxPercent.value));

    await this.servicePaymentTableService.create({
      userId: vServiceInstance.userId,
      serviceInstanceId: serviceInstanceId,
      price: -priceWithTax,
      paymentType: PaymentTypes.PayToServiceByBudgeting,
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
      taxPercent: toInteger(taxPercent.value),
    });

    const priceForNextPeriodWithTax: number =
      data.paidAmountForNextPeriod * (1 + Number(taxPercent.value));

    if (vServiceInstance.credit < priceForNextPeriodWithTax) {
      throw new NotEnoughCreditException();
    }

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
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: {
        propertyKey: 'TaxPercent',
      },
    });
    const paidAmountWithTax: number =
      data.paidAmount * (1 + Number(taxPercent.value));

    if (isNil(user)) {
      throw new NotFoundException();
    }

    if (userCredit == 0 || paidAmountWithTax > userCredit) {
      throw new NotEnoughCreditException();
    }

    const transactionDto: CreateTransactionsDto = {
      userId: userId.toString(),
      dateTime: new Date(),
      value: -paidAmountWithTax,
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
      price: paidAmountWithTax,
    });

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      paymentType: PaymentTypes.PayToServiceByUserCredit,
      price: -paidAmountWithTax,
      taxPercent: Number(taxPercent.value),
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
    });

    return true;
  }

  async withdrawServiceCreditToUserCredit(
    userId: number,
    serviceInstanceId: string,
    amount: number,
  ) {
    const vServiceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
      });
    if (isNil(vServiceInstance)) {
      throw new NotFoundException();
    }
    if (vServiceInstance.credit == 0 || amount > vServiceInstance.credit) {
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

  async getCredit(
    serviceInstanceId: string,
  ): Promise<BudgetingResultDtoFormat> {
    const vServiceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findById(serviceInstanceId);
    const perHour: number = await this.calculateCostPerHour(
      vServiceInstance.serviceItems,
    );
    const hoursLeft: number = Number(vServiceInstance.credit) / perHour;

    const budgetingResult: BudgetingResultDtoFormat = {
      id: vServiceInstance.id,
      name: vServiceInstance.name,
      credit: vServiceInstance.credit,
      perHour: perHour,
      hoursLeft: hoursLeft,
      serviceType: vServiceInstance.serviceTypeId,
    };

    return budgetingResult;
  }

  async calculateCostPerHour(serviceItems: ServiceItems[]) {
    const invoiceItems: InvoiceItemsDto[] =
      this.vdcFactoryService.transformItems(serviceItems);

    const hourlyCost: TotalInvoiceItemCosts =
      await this.paygCostCalculationService.calculateVdcPaygTypeInvoice(
        {
          itemsTypes: invoiceItems,
          duration: 1,
        },
        60,
      );

    return hourlyCost.totalCost;
  }
}
