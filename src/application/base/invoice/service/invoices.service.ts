import {
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
    private readonly invoicePropertiesTable: InvoicePropertiesTableService,
    private readonly vgpuService: VgpuService,
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
    if (serviceType == 'vgpu') {
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


  async createInvoice(
    userId,
    ServiceInstanceID,
    totalCost,
    qualityPlanId,
    payed,
  ) {
    throw new InternalServerErrorException('Not Implemented');
    await this.invoicesTable.create({
      userId: userId,
      serviceInstanceId: ServiceInstanceID,
      rawAmount: totalCost.rawAmount,
      finalAmount: totalCost.finalAmount,
      description: 'dsc',
      dateTime: new Date(),
      payed: payed,
      voided: false,
      //qualityPlan: qualityPlanId ??????
    });
    const invoice = await this.invoicesTable.findOne({ where: { ServiceInstanceID } });
    return Promise.resolve(invoice.id);
  }


    
  async createServiceInvoice(data, options, serviceId) {
    const userId = options.accessToken.userId;
    const unlimitedService = 0;
    const plans = await this.plansTable.find({});
    let itemTypes = null;
    itemTypes = await this.itemTypesTable.find({
      where: { ServiceTypeID: serviceId },
    });
    // get service type info
    const serviceType = await this.serviceTypesTable.findOne({
      where: { ID: serviceId },
    });
    //check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }

    throw new InternalServerErrorException('Must be resolved');
    // check Availablity of creating new Service
    // await this.serviceChecksService.checkServiceMaxAvailable(
    //   unlimitedService,
    //   serviceType.maxAvailable,
    //   serviceId,
    //   userId,
    // );
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
    const plansCost = this.costCalculationService.plansCost(plans, data);
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
    );
    let duration = data.duration;
    if (data.ServiceTypeID == 'vgpu') {
      await this.vgpuService.chackAvalibleToPowerOnVgpu(userId);
      duration = 36;
    }
    // create service Invoice
    let dto: CreateInvoicesDto;
    dto.userId = userId;
    dto.rawAmount = itemCost;
    dto.finalAmount = totalCosts;
    dto.type = 0;
    dto.endDateTime = addMonths(new Date(), duration);
    dto.dateTime = new Date();
    dto.serviceTypeId = data.serviceTypeID;
    dto.name = data.name;
    dto.planAmount = plansCost;
    dto.planRatio = plansRatioForItems;
    const invoiceId = await this.invoicesTable.create(dto);

    await this.createInvoiceItems(
      invoiceId,
      itemTypes,
      data.items,
    );
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
    await this.createInvoiceProperties(
      data,
      invoiceId,
      data.ServiceTypeID,
    );
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

  async extendServiceInvoice(app, options, serviceInstanceId) {
    const userId = options.accessToken.userId;
    let expiredInvoice = null;
    // find user expired service invoice
    expiredInvoice = await this.getExpiredInvoice(userId, serviceInstanceId);
    const lastUserInvoicesList = await this.getUserLastInvoices(
      userId,
      serviceInstanceId,
    );
    let lastUserInvoiceID;
    lastUserInvoicesList.forEach((element) => {
      lastUserInvoiceID = Math.max(element.id);
    });
    const lastUserInvoice = lastUserInvoicesList.find(
      (el) => el.id == lastUserInvoiceID,
    );
    // find already created invoice or not
    const alreadyInvoiceCreated = await this.findAlreadyInvoiceCreated(
      userId,
      serviceInstanceId,
    );
    if (expiredInvoice === null) {
      return Promise.reject(new ForbiddenException());
    }
    if (alreadyInvoiceCreated) {
      return Promise.resolve({ invoiceId: alreadyInvoiceCreated.id });
    }
    if (!alreadyInvoiceCreated) {
      const duration = Math.round(
        (expiredInvoice.EndDateTime - expiredInvoice.DateTime) / 86400000,
      );
      let DateTime;
      let EndDateTime;
      if (lastUserInvoice) {
        DateTime = lastUserInvoice.endDateTime;
        EndDateTime = addMonths(lastUserInvoice.endDateTime, duration / 30);
      } else {
        DateTime = expiredInvoice.EndDateTime;
        EndDateTime = addMonths(expiredInvoice.EndDateTime, duration / 30);
      }
      const itemTypes = await app.models.InvoiceItems.find({
        where: {
          InvoiceID: expiredInvoice.ID,
        },
      });

      throw new InternalServerErrorException('MOVE: Plans cost undefined ');
      const invoiceId = await this.invoicesTable.create({
        userId: userId,
        rawAmount: expiredInvoice.rawAmount, // Total cost of service items
        finalAmount: expiredInvoice.FinalAmount,
        description: 'description',
        dateTime: DateTime,
        payed: false,
        voided: false,
        endDateTime: EndDateTime,
        type: 1,
        serviceTypeId: expiredInvoice.ServiceTypeID,
        name: expiredInvoice.ServiceTypeID.Name,
        //  planAmount: plansCost,
        //  planRatio: plansRatio,
        serviceInstanceId: serviceInstanceId,
      });

      throw new InternalServerErrorException('MOVE: data undefined  ');

      //   await createInvoiceItems(invoiceId, itemTypes, data, app);
      //   await createTransaction(expiredInvoice.FinalAmount,invoiceId,expiredInvoice.ServiceTypeID.Title,userId,app);
      return Promise.resolve({ invoiceId: invoiceId });
    }
    return Promise.resolve({ invoiceId: null });
  }



}
