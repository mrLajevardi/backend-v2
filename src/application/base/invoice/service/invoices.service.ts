import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { isEmpty, isNil } from 'lodash';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { InvoicesChecksService } from './invoices-checks.service';
import { CostCalculationService } from './cost-calculation.service';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';

import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../../crud/invoice-properties-table/invoice-properties-table.service';
import { CreateInvoiceItemsDto } from '../../crud/invoice-items-table/dto/create-invoice-items.dto';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { CreateInvoicePluralDto } from '../../crud/invoices-table/dto/create-invoice-plural.dto';
import { VgpuPcNamePassRequired } from 'src/infrastructure/exceptions/vgpu-pc-name-pass-required.exception';
import { CreateInvoicesDto } from '../../crud/invoices-table/dto/create-invoices.dto';
import { ServiceChecksService } from '../../service/services/service-checks/service-checks.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePlansTableService } from '../../crud/service-plans-table/service-plans-table.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesTable: InvoicesTableService,
    private readonly plansTable: PlansTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly serviceTypesTable: ServiceTypesTableService,
    private readonly invoiceChecksService: InvoicesChecksService,
    private readonly costCalculationService: CostCalculationService,
    private readonly invoiceItemsTable: InvoiceItemsTableService,
    private readonly transactionTable: TransactionsTableService,
    private readonly invoicePlansTable: InvoicePlansTableService,
    private readonly invoicePropertiesTable: InvoicePropertiesTableService, // private readonly vgpuService: VgpuService,
    private readonly vgpuService: VgpuService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly plansTableService: PlansTableService,
    private readonly serviceItemsSumService: ServiceItemsSumService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly servicePlansTableService: ServicePlansTableService,
  ) {}

  // Create invoice items
  async createInvoiceItems(invoiceID: number, items, data) {
    for (const item of Object.keys(items)) {
      let dto: CreateInvoiceItemsDto;
      const itemTitle = items[item].Code;
      dto.fee = items[item].Fee;
      dto.invoiceId = invoiceID;
      dto.itemId = items[item].ID;
      dto.quantity = data[itemTitle];
      await this.invoiceItemsTable.create(dto);
    }
  }

  async createInvoiceProperties(data, InvoiceID, serviceType) {
    if (serviceType !== 'vgpu') {
      return;
    }
    const pcProp = {
      pcName: data.pcName,
      pcPassword: data.pcPassword,
    };
    if (isNil(data.pcName) || isNil(data.pcPassword)) {
      return Promise.reject(new VgpuPcNamePassRequired());
    }
    for (const item of Object.keys(pcProp)) {
      await this.invoicePropertiesTable.create({
        invoiceId: InvoiceID,
        propertyKey: item,
        value: pcProp[item],
      });
    }
  }

  // Create multiple invoice plans
  async createInvoicePlans(dto: CreateInvoicePluralDto) {
    for (const plan of dto.plans) {
      await this.invoicePlansTable.create({
        invoiceId: dto.invoiceId,
        planCode: plan.planCode,
        ratio: plan.ratio,
        amount: plan.amount,
      });
    }
  }

  // async createServiceInvoice(data, options, serviceId) {
  //   const userId = options.accessToken.userId;
  //   const unlimitedService = 0;
  //   const plans = await this.plansTable.find({});
  //   let itemTypes = null;
  //   itemTypes = await this.itemTypesTable.find({
  //     where: { ServiceTypeID: serviceId },
  //   });
  //   // get service type info
  //   const serviceType = await this.serviceTypesTable.findOne({
  //     where: { ID: serviceId },
  //   });
  //   //check validity of serviceId
  //   if (isEmpty(serviceType)) {
  //     throw new InvalidServiceIdException();
  //   }

  //   throw new InternalServerErrorException('Must be resolved');
  //   // check Availablity of creating new Service
  //   // await this.serviceChecksService.checkServiceMaxAvailable(
  //   //   unlimitedService,
  //   //   serviceType.maxAvailable,
  //   //   serviceId,
  //   //   userId,
  //   // );
  //   // checking plans condition
  //   const approvedPlans = await this.invoiceChecksService.checkPlanCondition(
  //     data.plans,
  //     serviceId,
  //     data.duration * 30,
  //   );
  //   // calculate costs
  //   const itemCost = this.costCalculationService.itemsCost(
  //     itemTypes,
  //     data,
  //     serviceType,
  //   );
  //   const plansCost = this.costCalculationService.plansCost(plans, data);
  //   const plansRatioForInvoice =
  //     this.costCalculationService.plansRatioForInvoice(plans, data);
  //   const plansRatioForItems = this.costCalculationService.plansRatioForItems(
  //     plans,
  //     data,
  //   );
  //   const totalCosts = this.costCalculationService.totalCosts(
  //     serviceType,
  //     data,
  //     plans,
  //     itemTypes,
  //   );
  //   const duration = data.duration;
  //   // CIRCULAR depencency
  //   // if (data.ServiceTypeID == 'vgpu') {
  //   //   await this.vgpuService.chackAvalibleToPowerOnVgpu(userId);
  //   //   duration = 36;
  //   // }
  //   // create service Invoice
  //   let dto: CreateInvoicesDto;
  //   dto.userId = userId;
  //   dto.rawAmount = itemCost;
  //   dto.finalAmount = totalCosts;
  //   dto.type = 0;
  //   dto.endDateTime = addMonths(new Date(), duration);
  //   dto.dateTime = new Date();
  //   dto.serviceTypeId = data.serviceTypeID;
  //   dto.name = data.name;
  //   dto.planAmount = plansCost;
  //   dto.planRatio = plansRatioForItems;
  //   const invoiceId = await this.invoicesTable.create(dto);

  //   await this.createInvoiceItems(invoiceId, itemTypes, data.items);
  //   await this.transactionTable.create({
  //     userId: userId,
  //     dateTime: new Date(),
  //     paymentType: 0,
  //     paymentToken: '-',
  //     isApproved: false,
  //     value: totalCosts,
  //     invoiceId: invoiceId,
  //     description: serviceType.title,
  //     serviceInstanceId: serviceId,
  //   });
  //   await this.createInvoicePlans({
  //     plans: approvedPlans,
  //     invoiceId: invoiceId,
  //   });
  //   await this.createInvoiceProperties(data, invoiceId, data.ServiceTypeID);
  //   return Promise.resolve({ invoiceId: invoiceId });
  // }
  async createInvoice(
    data,
    options,
    serviceId,
    type = 0,
    serviceInstanceId = null,
  ) {
    // types : 1: extend, 2: increaseResource, 0: create service
    const types = [0, 2, 1];
    const userId = options.accessToken.userId;
    const serviceInstanceIdNotExists =
      (type === 2 || type === 1) && !serviceInstanceId;
    let calculatePlanCost = true;
    let newDuration;
    let prevPlans;
    if (!types.includes(type) || serviceInstanceIdNotExists) {
      throw new BadRequestException();
    }
    if (serviceInstanceId) {
      const service = await this.serviceInstancesTableService.findById(
        serviceInstanceId,
      );
      if (!service || service.isDeleted || service.userId != userId) {
        throw new BadRequestException();
      }
      // overWrite name and serviceType with existing service's name and serviceTypeID
      data.Name = service.name;
      data.ServiceTypeID = service.serviceType;
    }
    // overwrite probable given plans with service instance's plans
    if (type === 2) {
      const result = await this.increaseServiceResources(serviceInstanceId);
      prevPlans = result.prevPlans;
      newDuration = result.newDuration;
      data.plans = prevPlans;
      calculatePlanCost = false;
    }
    /**
     checks if service is expired or not and overwrite items and plans
     with existing service's items and plans
    */
    if (type === 1) {
      const isExpired = await this.checkServiceIsExpired(serviceInstanceId);
      if (!isExpired) {
        throw new BadRequestException();
      }
      const serviceInfo = await this.getCreatedServicePlansAndItems(
        serviceInstanceId,
      );
      const { items, plans, duration } = serviceInfo;
      data = {
        ...data,
        plans,
        items,
        duration,
      };
    }
    const unlimitedService = 0;
    const plans = await this.plansTableService.find();
    let itemTypes = null;
    itemTypes = await this.itemTypesTable.find({
      where: { ServiceTypeID: serviceId },
    });
    // get service type info
    const serviceType = await this.serviceTypesTable.findOne({
      where: { ID: serviceId },
    });
    // check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }
    // check Availablity of creating new Service
    await this.invoiceChecksService.checkMaxService(
      unlimitedService,
      serviceType.maxAvailable,
      serviceId,
      userId,
    );

    await this.invoiceChecksService.checkInvoiceItems(
      itemTypes,
      data.items,
      serviceId,
    );
    // checking plans condition
    const approvedPlans = await this.invoiceChecksService.checkPlanCondition(
      data.plans,
      serviceId,
      data.duration * 30,
    );
    // calculate costs
    const itemCost = this.costCalculationService.itemsCost(
      itemTypes,
      data,
      serviceType,
    );
    if (type == 2) {
      data.duration = newDuration;
    }
    const plansCost = this.costCalculationService.plansCost(plans, data, {
      calculatePlanCost,
    });
    const plansRatioForInvoice =
      this.costCalculationService.plansRatioForInvoice(plans, data);
    const plansRatioForItems = this.costCalculationService.plansRatioForItems(
      plans,
      data,
    );
    const totalCosts = this.costCalculationService.totalCosts(
      serviceType,
      data,
      plans,
      itemTypes,
      { calculatePlanCost },
    );
    let duration = data.duration;
    if (data.ServiceTypeID == 'vgpu') {
      await this.vgpuService.chackAvalibleToPowerOnVgpu(userId);
      duration = 36;
    }
    const dto: CreateInvoicesDto = {
      userId,
      rawAmount: itemCost,
      finalAmount: totalCosts,
      type,
      endDateTime: addMonths(new Date(), duration),
      dateTime: new Date(),
      serviceTypeId: data.serviceTypeID,
      name: data.name,
      planAmount: plansCost,
      planRatio: plansRatioForItems,
      payed: false,
      voided: false,
      serviceInstanceId,
      description: 'description',
    };

    const invoiceId = await this.invoicesTable.create(dto);
    await this.createInvoiceItems(invoiceId, itemTypes, data.items);
    await this.transactionTable.create({
      userId: userId,
      dateTime: new Date(),
      paymentType: 0,
      paymentToken: '-',
      isApproved: false,
      value: totalCosts,
      invoiceId: invoiceId,
      description: serviceType.title,
      serviceInstanceId: serviceId,
    });
    await this.createInvoicePlans({
      plans: approvedPlans,
      invoiceId: invoiceId,
    });
    await this.createInvoiceProperties(data, invoiceId, data.ServiceTypeID);
    return Promise.resolve({ invoiceId: invoiceId });
  }
  async getExpiredInvoice(userId, serviceInstanceId) {
    return await this.invoicesTable.findOne({
      where: {
        and: [
          { UserID: userId },
          { ServiceInstanceID: serviceInstanceId },
          { Type: 0 },
          { Payed: true },
        ],
      },
    });
  }

  async getUserLastInvoices(userId, serviceInstanceId) {
    return await this.invoicesTable.find({
      where: {
        and: [
          { UserID: userId },
          { ServiceInstanceID: serviceInstanceId },
          { Type: 1 },
          { Payed: true },
        ],
      },
    });
  }

  async findAlreadyInvoiceCreated(userId, serviceInstanceId) {
    return await this.invoicesTable.findOne({
      where: {
        and: [
          { UserID: userId },
          { ServiceInstanceID: serviceInstanceId },
          { Type: 1 },
          { Payed: false },
        ],
      },
    });
  }

  async checkServiceIsExpired(serviceInstanceId) {
    const service = await this.serviceInstancesTableService.findById(
      serviceInstanceId,
    );
    const now = new Date().getTime();
    const expireDate = new Date(service.expireDate).getTime();
    if (expireDate > now) {
      return false;
    }
    return true;
  }
  async getCreatedServicePlansAndItems(serviceInstanceId) {
    const serviceItems = await this.serviceItemsTableService.find({
      where: {
        ServiceInstanceID: serviceInstanceId,
      },
    });
    const formattedServiceItems = serviceItems.map((item) => {
      return {
        itemCode: item.itemTypeCode,
        quantity: item.quantity,
      };
    });
    const servicePlans = await this.servicePlansTableService.find({
      where: {
        ServiceInstanceID: serviceInstanceId,
      },
    });
    let duration = 0;
    const servicePlanCodesList = servicePlans.map((plan) => {
      const planDurations = {
        sixMonthPeriod: 6,
        threeMonthPeriod: 3,
        oneMonthPeriod: 1,
      };
      if (planDurations[plan.planCode]) {
        duration = planDurations[plan.planCode];
      }
      return plan.planCode;
    });
    return {
      items: formattedServiceItems,
      plans: servicePlanCodesList,
      duration,
    };
  }

  async increaseServiceResources(serviceInstanceId) {
    if (!serviceInstanceId) {
      throw new BadGatewayException();
    }
    const service = await this.serviceInstancesTableService.findById(
      serviceInstanceId,
    );
    if (!service) {
      throw new BadGatewayException();
    }
    const servicePeriods = {
      oneMonthPeriod: 1,
      threeMonthPeriod: 3,
      sixMonthPeriod: 6,
    };
    const servicePlans = await this.servicePlansTableService.find({
      where: {
        ServiceInstanceID: serviceInstanceId,
      },
    });
    let targetPeriod = 0;
    const prevPlans = servicePlans.map((servicePlan) => {
      console.log(servicePlan.planCode);
      if (servicePeriods[servicePlan.planCode]) {
        targetPeriod = servicePeriods[servicePlan.planCode];
      }
      return servicePlan.planCode;
    });
    const timeDiff =
      new Date(service.expireDate).getTime() - new Date().getTime();
    const dayDiff = Math.floor(timeDiff / (24 * 3600 * 1000));
    const newDuration = ((targetPeriod * 30 - dayDiff) / 30).toFixed(1);
    console.log(targetPeriod, newDuration);
    return {
      prevPlans,
      newDuration,
    };
  }
}
