import { Injectable } from '@nestjs/common';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { ServicePlanTypeEnum } from '../../service/enum/service-plan-type.enum';
import { IncreaseBudgetCreditDto } from '../dto/increase-budget-credit.dto';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { User } from '../../../../infrastructure/database/entities/User';
import { NotEnoughCreditException } from '../../../../infrastructure/exceptions/not-enough-credit.exception';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { PaidFromBudgetCreditDto } from '../dto/paid-from-budget-credit.dto';
import { isNil } from 'lodash';
import { NotFoundException } from '../../../../infrastructure/exceptions/not-found.exception';
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
import { ServiceStatusEnum } from '../../service/enum/service-status.enum';

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

  async handleInsufficientCredit(
    vServiceInstance: VServiceInstances,
    price: number,
  ): Promise<PaymentTypes> {
    if (price < vServiceInstance.credit) {
      return PaymentTypes.PayToServiceByBudgeting;
    } else if (
      price < vServiceInstance.userCredit + vServiceInstance.credit &&
      vServiceInstance.autoPaid
    ) {
      return PaymentTypes.PayToBudgetingByUserCreditAutoPaid;
    }

    const exception: boolean = await this.handleServiceStatus(
      vServiceInstance,
      price,
    );

    if (exception) {
      this.baseFactoryException.handle(NotEnoughCreditException);
    }
  }

  async handleServiceStatus(
    vServiceInstance: VServiceInstances,
    price: number,
  ): Promise<boolean> {
    if (!vServiceInstance.autoPaid && price > vServiceInstance.credit) {
      await this.serviceInstancesTableService.update(vServiceInstance.id, {
        status: ServiceStatusEnum.ExceededEnoughCredit,
      });
      return Promise.resolve(true);
    } else if (
      vServiceInstance.autoPaid &&
      price > vServiceInstance.userCredit + vServiceInstance.credit
    ) {
      await this.serviceInstancesTableService.update(vServiceInstance.id, {
        status: ServiceStatusEnum.ExceededEnoughCreditAndNotEnoughUserCredit,
      });

      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
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

    if (vServiceInstance.userId == 2250) {
      console.log(
        ' \n\n\n\n\n\n<debug_payg>: vServiceInstance ok ',
        vServiceInstance,
        '\n\n\n\n\n\n',
      );
    }

    if (vServiceInstance.userId == 2250) {
      console.log(
        ' \n\n\n\n\n\n<debug_payg>: price ok ',
        priceWithTax,
        '\n\n\n\n\n\n',
      );
    }

    await this.paidFromUserCredit(vServiceInstance, priceWithTax);

    await this.servicePaymentTableService.create({
      userId: vServiceInstance.userId,
      serviceInstanceId: serviceInstanceId,
      price: -priceWithTax,
      paymentType:
        priceWithTax < vServiceInstance.userCredit + vServiceInstance.credit &&
        vServiceInstance.autoPaid
          ? PaymentTypes.PayToBudgetingByUserCreditAutoPaid
          : PaymentTypes.PayToServiceByBudgeting,
      metaData: !isNil(metaData) ? JSON.stringify(metaData) : null,
      taxPercent: taxPercent,
    });

    await this.handleInsufficientCredit(vServiceInstance, priceWithTax);

    const priceForNextPeriodWithTax: number = this.priceWithTax(
      data.paidAmountForNextPeriod,
      taxPercent,
    );

    if (vServiceInstance.userId == 2250) {
      console.log(
        ' \n\n\n\n\n\n<debug_payg>: priceForNextPeriodWithTax ok ',
        priceForNextPeriodWithTax,
        '\n\n\n\n\n\n',
      );
    }
    await this.handleInsufficientCredit(
      vServiceInstance,
      priceForNextPeriodWithTax,
    );

    return true;
  }

  async paidFromUserCredit(
    vServiceInstance: VServiceInstances,
    priceWithTax: number,
  ): Promise<void> {
    if (
      vServiceInstance.autoPaid &&
      priceWithTax < vServiceInstance.userCredit + vServiceInstance.credit
    ) {
      await this.serviceInstancesTableService.update(vServiceInstance.id, {
        status: ServiceStatusEnum.ExceededEnoughCreditAndUsingUserCredit,
      });

      await this.transactionsTableService.create({
        userId: vServiceInstance.userId.toString(),
        serviceInstanceId: vServiceInstance.id,
        paymentType: PaymentTypes.PayToBudgetingByUserCreditAutoPaid,
        value: -(priceWithTax - vServiceInstance.credit),
        isApproved: true,
        dateTime: new Date(),
        description: 'auto paid from user credit to service budgeting',
      });
    }
  }

  priceWithTax(price: number, taxPercent: number) {
    return price * (1 + taxPercent);
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
