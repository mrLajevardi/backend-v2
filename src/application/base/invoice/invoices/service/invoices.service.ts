import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { CreateInvoiceDto } from 'src/application/base/invoice/invoices/dto/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/application/base/invoice/invoices/dto/update-invoice.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { PlansService } from '../../../plans/plans.service';
import { ItemTypesService } from '../../../service/item-types/item-types.service';
import { ServiceTypesService } from '../../../service/service-types/service-types.service';
import { isEmpty } from 'lodash';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { InvoicesChecksService } from './invoices-checks.service';
import { CostCalculationService } from './cost-calculation.service';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { InvoiceItemsService } from '../../invoice-items/invoice-items.service';
import { TransactionsService } from '../../../transactions/transactions.service';
import { InvoicePlansService } from '../../invoice-plans/invoice-plans.service';
import { InvoicePropertiesService } from '../../invoice-properties/invoice-properties.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { ServiceChecksService } from '../../../service/service-instances/services/service-checks/service-checks.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoices)
    private readonly repository: Repository<Invoices>,
    private readonly plansService: PlansService,
    private readonly itemTypesService: ItemTypesService,
    private readonly serviceTypesService: ServiceTypesService,
    private readonly invoiceChecksService: InvoicesChecksService,
    private readonly costCalculationService: CostCalculationService,
    private readonly invoiceItemsService: InvoiceItemsService,
    private readonly transactionService: TransactionsService,
    private readonly invoicePlansService: InvoicePlansService,
    private readonly invoicePropertiesService: InvoicePropertiesService,
    private readonly vgpuService: VgpuService,

  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Invoices> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Invoices[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Invoices> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateInvoiceDto): Promise<number> {
    const newItem = plainToClass(Invoices, dto);
    const createdItem = this.repository.create(newItem);
    const result = await this.repository.save(createdItem);
    return result.id;
  }

  async createInvoice(userId, ServiceInstanceID, totalCost, qualityPlanId,payed) {
    throw new InternalServerErrorException("Not Implemented")
    await this.create({
        userId: userId,
        serviceInstanceId: ServiceInstanceID, 
        rawAmount: totalCost.rawAmount,
        finalAmount: totalCost.finalAmount,
        description: "dsc",
        dateTime: new Date(),
        payed: payed,
        voided: false,
        //qualityPlan: qualityPlanId ??????
    })
    const invoice = await this.findOne({where: {ServiceInstanceID }})
    return Promise.resolve(invoice.id)
}


  async createServiceInvoice(data, options, serviceId) {
    const userId = options.accessToken.userId;
    const unlimitedService = 0;
    const plans = await this.plansService.find({});
    let itemTypes = null;
    itemTypes = await this.itemTypesService.find({
      where: { ServiceTypeID: serviceId },
    });
    // get service type info
    const serviceType = await this.serviceTypesService.findOne({
      where: { ID: serviceId },
    });
    //check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }

    throw new InternalServerErrorException("Must be resolved")
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
    let dto: CreateInvoiceDto;
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
    const invoiceId = await this.create(dto);

    await this.invoiceItemsService.createInvoiceItems(
      invoiceId,
      itemTypes,
      data.items,
    );
    await this.transactionService.create({
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
    await this.invoicePlansService.createInvoicePlans({
      plans: approvedPlans,
      invoiceId: invoiceId,
    });
    await this.invoicePropertiesService.createInvoiceProperties(
      data,
      invoiceId,
      data.ServiceTypeID,
    );
    return Promise.resolve({ invoiceId: invoiceId });
  }

  async getExpiredInvoice(userId, serviceInstanceId) {
    return await this.findOne({
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
    return await this.find({
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
    return await this.findOne({
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
      const invoiceId = await this.create({
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

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateInvoiceDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Invoices> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }
}
