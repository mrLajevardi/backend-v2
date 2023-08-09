import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
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
  ) {}

  async increaseServiceResources(options, invoice) {
    const userId = options.user.userId;
    const serviceInstanceId = invoice.ServiceInstanceID;

    const oldService = await this.serviceInstancesTableService.findOne({
      where: {
        userId: userId,
        serviceInstanceId: serviceInstanceId,
        isDeleted: false,
      },
    });
    if (!oldService) {
      return Promise.reject(new ForbiddenException());
    }
    const invoiceItems = await this.invoiceItemsTable.find({
      where: {
        InvoiceID: invoice.ID,
      },
    });
    console.log({ invoiceItems, invoice }, '😚');
    for (const invoiceItem of invoiceItems) {
      const targetItem = await this.serviceItemsTable.findOne({
        where: {
          ItemTypeID: invoiceItem.itemId,
          ServiceInstanceID: serviceInstanceId,
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

  async getInvoice(options, invoiceId: number = null) {
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
        invoiceId: invoiceId,
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

  async getItemTypes(options, filter) {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const itemTypes = await this.itemTypesTable.find(parsedFilter);
    return Promise.resolve(itemTypes);
  }

  async getServicePlans(options) {
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

  async getServicetypes(options, filter) {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const serviceTypes = await this.serviceTypesTable.find(parsedFilter);
    return Promise.resolve(serviceTypes);
  }

  async getZarinpalAuthority(options, invoiceId = null) {
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
    zarinpalConfig.metadata.email = options.locals.username;
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

  async updateServiceInfo(options, serviceInstanceId, data) {
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

  async verifyZarinpalAuthority(options, authority = null) {
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

      options.locals = {
        ...options.locals,
        serviceInstanceId,
      };
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
          userId: options.locals.userId,
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
          requestOptions: options.locals,
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
          userId: options.locals.userId,
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
  async createServiceItems(serviceInstanceId, items, data) {
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

  async getServices(options: any, id?: string) {
    const {
      user: { userId },
    } = options;
    const where: any = {
      userId,
      isDeleted: false,
      serviceTypeId: In(['vdc', 'vgpu', 'aradAi']),
    };
    if (id) {
      where.id = id;
    }
    const services = await this.serviceInstancesTableService.find({
      where,
      relations: ['serviceItems'],
    });
    const extendedServiceList = services.map((service) => {
      const expired =
        new Date(service.expireDate).getTime() < new Date().getTime();
      console.log(expired);
      return {
        ...service,
        expired,
      };
    });
    return extendedServiceList;
  }
}
