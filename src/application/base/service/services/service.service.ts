import { Injectable, Scope } from '@nestjs/common';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { In } from 'typeorm';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { isEmpty } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { ExtendServiceService } from './extend-service.service';
import { PaymentService } from 'src/application/payment/payment.service';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { InvoiceItemListService } from '../../crud/invoice-item-list/invoice-item-list.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { ZarinpalConfigDto } from 'src/application/payment/dto/zarinpal-config.dto';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { GetInvoiceReturnDto } from '../dto/return/get-invoice.dto';
import { GetServicePlansReturnDto } from '../dto/return/get-service-plans.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { UpdateServiceInstancesDto } from '../../crud/service-instances-table/dto/update-service-instances.dto';
import { ZarinpalVerifyReturnDto } from '../dto/return/zarinpal-verify.dto';
import { GetServicesReturnDto } from '../dto/return/get-services.dto';
import { GetAllVdcServiceWithItemsResultDto } from '../dto/get-all-vdc-service-with-items-result.dto';
import { VdcService } from '../../../vdc/service/vdc.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { GetOrgVdcResult } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly tasksTable: TasksTableService,
    private readonly extendServiceService: ExtendServiceService,
    private readonly paymentService: PaymentService,
    private readonly discountsTable: DiscountsTableService,
    private readonly invoiceItemListTable: InvoiceItemListService,
    private readonly invoicePlansTable: InvoicePlansTableService,
    private readonly invoiceDiscountsTable: InvoiceDiscountsTableService,
    private readonly plansTable: PlansTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly usersTable: UserTableService,
    private readonly invoiceItemsTable: InvoiceItemsTableService,
    private readonly serviceTypesTable: ServiceTypesTableService,
    private readonly vdcService: VdcService,
    private readonly serviceFactory: ServiceServiceFactory,
  ) {}

  async increaseServiceResources(
    options: SessionRequest,
    invoice: Invoices,
  ): Promise<ServiceInstances> {
    const userId = options.user.userId;
    const serviceInstanceId = invoice.serviceInstanceId;

    const oldService = await this.serviceInstancesTableService.findOne({
      where: {
        userId: userId,
        id: serviceInstanceId,
        isDeleted: false,
      },
    });
    if (!oldService) {
      return Promise.reject(new ForbiddenException());
    }
    const invoiceItems = await this.invoiceItemsTable.find({
      where: {
        invoiceId: invoice.id,
      },
    });
    console.log({ invoiceItems, invoice }, '😚');
    for (const invoiceItem of invoiceItems) {
      const targetItem = await this.serviceItemsTable.findOne({
        where: {
          itemTypeId: invoiceItem.itemId,
          serviceInstanceId: serviceInstanceId,
        },
      });
      console.log({ targetItem }, '😚');

      const updatedQuantity = targetItem.quantity + invoiceItem.quantity;
      console.log({ updatedQuantity }, '😚');

      await this.serviceItemsTable.updateAll(
        {
          id: targetItem.id || null,
        },
        {
          quantity: updatedQuantity,
        },
      );
    }
    await this.serviceInstancesTableService.updateAll(
      {
        id: oldService.id,
      },
      {
        lastUpdateDate: new Date(),
      },
    );
    return oldService;
  }

  async getInvoice(
    options: SessionRequest,
    invoiceId: number = null,
  ): Promise<GetInvoiceReturnDto> {
    const userId = options.user.userId;
    const invoice = await this.invoicesTable.findOne({
      where: {
        id: invoiceId,
        userId: userId,
      },
    });
    console.log(invoiceId, userId);
    if (invoice === null) {
      return Promise.reject(new ForbiddenException());
    }
    const invoiceItemsList = await this.invoiceItemListTable.find({
      where: {
        invoiceId: invoiceId.toString(),
        userId: userId,
      },
    });
    const invoiceQuality = await this.invoicePlansTable.find({
      where: {
        invoiceId: invoice.id,
      },
    });
    const invoiceDiscount = await this.invoiceDiscountsTable.findOne({
      where: {
        invoiceId: invoice.id,
      },
    });
    let discount;
    // console.log(invoice);
    if (invoiceDiscount) {
      discount = await this.discountsTable.findOne({
        where: {
          id: invoiceDiscount.discount.id,
        },
      });
    }
    return Promise.resolve({
      invoice,
      invoiceItemsList,
      invoiceQuality,
      discount,
    });
  }

  async getItemTypes(
    options: SessionRequest,
    filter: string,
  ): Promise<ItemTypes[]> {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const itemTypes = await this.itemTypesTable.find(parsedFilter);
    return Promise.resolve(itemTypes);
  }

  async getServicePlans(): Promise<GetServicePlansReturnDto> {
    const plans = await this.plansTable.find();
    const organizedPlans = {};
    console.log(plans);
    for (const plan of plans) {
      const filteredPlan = {
        Code: plan.code,
        AdditionRatio: plan.additionRatio,
        AdditionAmount: plan.additionAmount,
        Description: plan.description,
      };
      organizedPlans[plan.code] = filteredPlan;
    }
    const data = {
      vdc: {
        servicePeriods: {
          oneMonthPeriod: organizedPlans['oneMonthPeriod'],
          sixMonthPeriod: organizedPlans['sixMonthPeriod'],
          threeMonthPeriod: organizedPlans['threeMonthPeriod'],
        },
        qualityPlans: {
          vdcBronze: organizedPlans['vdcBronze'],
          vdcGold: organizedPlans['vdcGold'],
          vdcSilver: organizedPlans['vdcSilver'],
        },
      },
    };
    return Promise.resolve(data);
  }

  async getServicetypes(
    options: SessionRequest,
    filter: string,
  ): Promise<ServiceTypes[]> {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const serviceTypes = await this.serviceTypesTable.find(parsedFilter);
    return Promise.resolve(serviceTypes);
  }

  async getZarinpalAuthority(
    options: SessionRequest,
    invoiceId: number = null,
  ): Promise<string> {
    const userId = options.user.userId;
    // find user invoice
    const invoice = await this.invoicesTable.findOne({
      where: {
        id: invoiceId,
        userId: userId,
      },
    });
    if (invoice === null) {
      return Promise.reject(new ForbiddenException());
    }

    // find user info
    const user = await this.usersTable.findOne({
      where: {
        id: userId,
      },
    });

    let zarinpalConfig: ZarinpalConfigDto;
    zarinpalConfig.metadata.email = options.user.username;
    zarinpalConfig.metadata.mobile = user.phoneNumber;

    const paymentRequestData = {
      ...zarinpalConfig,
      amount: invoice.finalAmount,
    };
    const authorityCode = await this.paymentService.zarinpal.paymentRequest(
      paymentRequestData,
    );

    if (authorityCode) {
      this.transactionsTable.updateAll(
        {
          invoiceId: invoiceId,
          userId: userId,
          isApproved: false,
        },
        {
          paymentToken: authorityCode,
        },
      );
    }
    return Promise.resolve(
      'https://www.zarinpal.com/pg/StartPay/' + authorityCode,
    );
  }

  async updateServiceInfo(
    options: SessionRequest,
    serviceInstanceId: string,
    data: UpdateServiceInstancesDto,
  ): Promise<void> {
    const { name } = data;
    await this.serviceInstancesTableService.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        name: name,
      },
    );
  }

  async verifyZarinpalAuthority(
    options: SessionRequest,
    authority: string | null = null,
  ): Promise<ZarinpalVerifyReturnDto> {
    const userId = options.user.userId;
    // find user transaction
    const transaction = await this.transactionsTable.findOne({
      where: {
        paymentToken: authority,
        userId: userId,
      },
    });
    if (transaction === null) {
      return Promise.reject(new ForbiddenException());
    }
    // find user invoice
    const invoice = await this.invoicesTable.findOne({
      where: {
        userId: userId,
        id: transaction.invoiceId,
      },
    });
    const paymentRequestData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: transaction.value,
      authority: authority,
    };
    const { verified, refID } =
      await this.paymentService.zarinpal.paymentVerify(paymentRequestData);
    let serviceInstanceId = null;
    let token = null;
    let task = null;
    let taskId = null;

    if (verified && !transaction.isApproved && invoice.type === 1) {
      const extendedService =
        await this.extendServiceService.extendServiceInstanceAndToken(
          options,
          invoice,
        );
      serviceInstanceId = extendedService.serviceInstanceId;
      token = extendedService['token'];

      // approve user transaction
      await this.transactionsTable.updateAll(
        {
          userId: userId,
          invoiceId: invoice.id,
        },
        {
          isApproved: true,
          serviceInstanceId: serviceInstanceId,
        },
      );
      // update user invoice
      this.invoicesTable.updateAll(
        {
          userId: userId,
          id: transaction.invoiceId,
        },
        {
          payed: true,
          serviceInstanceId: serviceInstanceId,
        },
      );
    }
    if (verified && !transaction.isApproved && invoice.type === 0) {
      // make user service instance

      const createdService =
        await this.extendServiceService.createServiceInstanceAndToken(
          options,
          invoice.endDateTime,
          invoice.serviceTypeId,
          transaction,
          invoice.name,
        );
      serviceInstanceId = createdService.serviceInstanceId;
      token = createdService['token'];

      // options.locals = {
      //   ...options.locals,
      //   serviceInstanceId,
      // };
      // approve user transaction
      await this.transactionsTable.updateAll(
        {
          userId: userId,
          paymentToken: authority,
        },
        {
          isApproved: true,
          serviceInstanceId: serviceInstanceId,
        },
      );
      if (invoice.serviceTypeId === 'vdc') {
        task = await this.tasksTable.create({
          userId: options.user.userId,
          serviceInstanceId: serviceInstanceId,
          operation: 'createDataCenter',
          details: null,
          startTime: new Date(),
          endTime: null,
          status: 'running',
        });
        await this.taskManagerService.addTask({
          serviceInstanceId,
          customTaskId: task.TaskID,
          vcloudTask: null,
          nextTask: 'createOrg',
          requestOptions: {
            serviceInstanceId: serviceInstanceId,
            userId: options.user.userId,
          },
          target: 'object',
        });
        taskId = task.TaskID;
      }

      if (invoice.serviceTypeId == 'aradAi') {
        await this.serviceInstancesTableService.updateAll(
          {
            id: serviceInstanceId,
          },
          {
            status: 3,
          },
        );
        task = await this.tasksTable.create({
          userId: options.user.userId,
          serviceInstanceId: serviceInstanceId,
          operation: 'aradAi',
          details: null,
          startTime: new Date(),
          endTime: new Date(),
          status: 'success',
        });
        await this.serviceInstancesTableService.updateAll(
          {
            id: serviceInstanceId,
          },
          {
            status: 3,
          },
        );
        taskId = task.TaskID;
      }
      // update user invoice
      this.invoicesTable.updateAll(
        {
          userId: userId,
          id: transaction.invoiceId,
        },
        {
          payed: true,
          serviceInstanceId: serviceInstanceId,
        },
      );
    }

    return Promise.resolve({
      verified: verified,
      refID: refID,
      id: serviceInstanceId,
      taskId: taskId,
      token: token,
    });
  }

  // Create Service Items
  async createServiceItems(
    serviceInstanceId: string,
    items: CreateServiceItemsDto[],
    data: object,
  ): Promise<void> {
    for (const item of Object.keys(items)) {
      let dto: CreateServiceItemsDto;
      const itemTitle = items[item].code;
      dto.quantity = data[itemTitle];
      dto.itemTypeId = items[item].id;
      dto.serviceInstanceId = serviceInstanceId;
      dto.itemTypeCode = items[item].code;
      await this.serviceItemsTable.create(dto);
    }
  }

  async getServicesWithItems(
    options: SessionRequest,
    typeId?: string,
    id?: string,
  ): Promise<
    GetAllVdcServiceWithItemsResultDto[] | GetAllVdcServiceWithItemsResultDto
  > {
    const res: GetAllVdcServiceWithItemsResultDto[] = [];

    const allServicesInstances = await this.getServices(options, typeId, id);

    for (const serviceInstance of allServicesInstances) {
      const cpuSpeed = (
        await this.serviceFactory.getConfigServiceInstance(serviceInstance)
      ).cpuSpeed;

      const { daysLeft, isExpired, isTicketSent } =
        await this.serviceFactory.getPropertiesOfServiceInstance(
          serviceInstance,
        );

      const vdcItems: GetOrgVdcResult = await this.vdcService.getVdc(
        options,
        serviceInstance.id,
      );

      const model = this.serviceFactory.configModelServiceInstanceList(
        serviceInstance,
        isExpired,
        daysLeft,
        isTicketSent,
        vdcItems,
        cpuSpeed,
      );

      res.push(model);
    }

    return res;
  }

  async getServices(
    options: SessionRequest,
    typeId?: string,
    id?: string,
  ): Promise<GetServicesReturnDto[]> {
    const {
      user: { userId },
    } = options;
    let serviceTypeIds = ['vdc', 'vgpu', 'aradAi'];
    if (typeId) {
      serviceTypeIds = [typeId];
    }
    const where: any = {
      userId: userId,
      isDeleted: false,
      serviceTypeId: In(serviceTypeIds),
    };
    if (id) {
      where.id = id;
    }
    const services = await this.serviceInstancesTableService.find({
      where,
      relations: ['serviceItems', 'serviceType'],
    });
    console.log(services);
    const extendedServiceList = services.map((service) => {
      const expired =
        new Date(service.expireDate).getTime() <= new Date().getTime();
      return {
        ...service,
        expired: expired,
        retryCount: service.retryCount,
      };
    });
    return extendedServiceList;
  }
}
