import { Injectable } from '@nestjs/common';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
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
import { VServiceInstancesTableService } from '../../crud/v-service-instances-table/v-service-instances-table.service';
import { VServiceInstances } from '../../../../infrastructure/database/entities/views/v-serviceInstances';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { PaygCostCalculationService } from '../../invoice/service/payg-cost-calculation.service';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { InvoiceItemsDto } from '../../invoice/dto/create-service-invoice.dto';
import { VdcFactoryService } from '../../../vdc/service/vdc.factory.service';
import { TotalInvoiceItemCosts } from '../../invoice/interface/invoice-item-cost.interface';
import { BudgetingResultDtoFormat } from '../dto/results/budgeting.result.dto';
import { NotEnoughServiceCreditForWeekException } from '../../../../infrastructure/exceptions/not-enough-service-credit-for-week.exception';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceInstances } from '../../../../infrastructure/database/entities/ServiceInstances';
import { BaseFactoryException } from '../../../../infrastructure/exceptions/base/base-factory.exception';

@Injectable()
export class BudgetingService {
  constructor(
    private readonly transactionsTableService: TransactionsTableService,
    private readonly userTableService: UserTableService,
    private readonly servicePaymentTableService: ServicePaymentsTableService,
    private readonly userInfoService: UserInfoService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly systemSettingsTableService: SystemSettingsTableService,
    private readonly paygCostCalculationService: PaygCostCalculationService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly baseFactoryException: BaseFactoryException,
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
          return await this.resolveResponse(item);
        },
      ),
    );

    return data;
  }

  async resolveResponse(
    item: VServiceInstances,
  ): Promise<BudgetingResultDtoFormat> {
    const perHour: number = await this.calculateCostPerHour(item.serviceItems);
    const hoursLeft: number = Number(item.credit) / perHour;
    return {
      id: item.id,
      name: item.name,
      credit: item.credit,
      perHour: perHour,
      hoursLeft: hoursLeft,
      autoPaid: item.autoPaid,
      serviceType: item.serviceTypeId,
    } as BudgetingResultDtoFormat;
  }

  async increaseBudgetingService(
    userId: number,
    serviceInstanceId: string,
    data: IncreaseBudgetCreditDto,
    type: PaymentTypes = PaymentTypes.PayToBudgetingByUserCredit,
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
      this.baseFactoryException.handle(NotEnoughCreditException);
    }

    await this.transactionsTableService.create({
      serviceInstanceId: serviceInstanceId,
      userId: userId.toString(),
      isApproved: true,
      dateTime: new Date(),
      value: -data.increaseAmount,
      paymentType: type,
    });

    await this.servicePaymentTableService.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      price: data.increaseAmount,
      paymentType: type,
    });

    return true;
  }

  async getTaxPercent(): Promise<number> {
    const taxPercent = await this.systemSettingsTableService.findOne({
      where: {
        propertyKey: 'TaxPercent',
      },
    });

    return Number(taxPercent.value);
  }

  async paidFromBudgetCredit(
    serviceInstanceId: string,
    data: PaidFromBudgetCreditDto,
    metaData?: any[],
  ): Promise<boolean> {
    const taxPercent: number = await this.getTaxPercent();

    const vServiceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findById(serviceInstanceId);

    if (isNil(vServiceInstance)) {
      throw new NotFoundException();
    }

    const priceWithTax: number = this.priceWithTax(data.paidAmount, taxPercent);

    const paymentType: PaymentTypes = this.handleInsufficientCredit(
      priceWithTax,
      vServiceInstance.credit,
      vServiceInstance.userCredit,
      vServiceInstance.autoPaid,
      false,
    );

    if (paymentType == PaymentTypes.PayToBudgetingByUserCreditAutoPaid) {
      await this.transactionsTableService.create({
        userId: vServiceInstance.userId.toString(),
        serviceInstanceId: serviceInstanceId,
        paymentType: PaymentTypes.PayToBudgetingByUserCreditAutoPaid,
        value: -(priceWithTax - vServiceInstance.credit),
        isApproved: true,
        dateTime: new Date(),
        description: 'auto paid from user credit to service budgeting',
      });
    }

    await this.servicePaymentTableService.create({
      userId: vServiceInstance.userId,
      serviceInstanceId: serviceInstanceId,
      price: -priceWithTax,
      paymentType: paymentType,
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
      taxPercent: taxPercent,
    });

    this.handleInsufficientCredit(
      priceWithTax,
      vServiceInstance.credit,
      vServiceInstance.userCredit,
      vServiceInstance.autoPaid,
      true,
    );

    const priceForNextPeriodWithTax: number = this.priceWithTax(
      data.paidAmountForNextPeriod,
      taxPercent,
    );

    this.handleInsufficientCredit(
      priceForNextPeriodWithTax,
      vServiceInstance.credit,
      vServiceInstance.userCredit,
      vServiceInstance.autoPaid,
      true,
    );

    return true;
  }

  handleInsufficientCredit(
    price: number,
    serviceCredit: number,
    userCredit: number,
    autoPaid: boolean,
    exception: boolean,
  ): PaymentTypes {
    if (price < serviceCredit) {
      return PaymentTypes.PayToServiceByBudgeting;
    }
    if (price < userCredit + serviceCredit && autoPaid) {
      return PaymentTypes.PayToBudgetingByUserCreditAutoPaid;
    }
    if (exception) {
      this.baseFactoryException.handle(NotEnoughCreditException);
    }
  }

  priceWithTax(price: number, taxPercent: number) {
    return price * (1 + taxPercent);
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
      this.baseFactoryException.handle(NotEnoughCreditException);
    }

    const transactionDto: CreateTransactionsDto = {
      userId: userId.toString(),
      dateTime: new Date(),
      value: -paidAmountWithTax,
      paymentType: PaymentTypes.PayToBudgetingByUserCredit,
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
      paymentType: PaymentTypes.PayToServiceByBudgeting,
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
  ): Promise<boolean> {
    const vServiceInstance: VServiceInstances =
      await this.vServiceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
          servicePlanType: ServicePlanTypeEnum.Payg,
          isDeleted: false,
        },
        relations: ['serviceItems'],
      });
    if (isNil(vServiceInstance)) {
      throw new NotFoundException();
    }
    if (vServiceInstance.credit == 0 || amount > vServiceInstance.credit) {
      this.baseFactoryException.handle(NotEnoughCreditException);
    }

    const perHourCost: number = await this.calculateCostPerHour(
      vServiceInstance.serviceItems,
    );

    if (vServiceInstance.credit <= perHourCost * 24 * 7) {
      this.baseFactoryException.handle(NotEnoughServiceCreditForWeekException);
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

    // const budgetingResult: BudgetingResultDtoFormat = {
    //     id: vServiceInstance.id,
    //     name: vServiceInstance.name,
    //     credit: vServiceInstance.credit,
    //     perHour: perHour,
    //     hoursLeft: hoursLeft,
    //     serviceType: vServiceInstance.serviceTypeId,
    // };

    return await this.resolveResponse(vServiceInstance);
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
    const taxPercent = await this.getTaxPercent();

    return this.priceWithTax(hourlyCost.totalCost, taxPercent);
  }

  async changeAutoPaidState(serviceInstanceId: string, autoPaid: boolean) {
    const updateServiceInstance: ServiceInstances =
      await this.serviceInstancesTableService.update(serviceInstanceId, {
        autoPaid: autoPaid,
      });

    const vService: VServiceInstances =
      await this.vServiceInstancesTableService.findOne({
        where: {
          id: serviceInstanceId,
        },
        relations: ['serviceItems'],
      });

    return await this.resolveResponse(vService);
  }
}
