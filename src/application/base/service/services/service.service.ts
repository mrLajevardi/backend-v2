import { Injectable } from '@nestjs/common';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { FindOptionsWhere, In } from 'typeorm';
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
import { GetServicesReturnDto } from '../dto/return/get-services.dto';
import { GetAllVdcServiceWithItemsResultDto } from '../dto/get-all-vdc-service-with-items-result.dto';
import { VdcService } from '../../../vdc/service/vdc.service';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { GetOrgVdcResult } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { VcloudMetadata } from '../../datacenter/type/vcloud-metadata.type';
import { UserService } from '../../user/service/user.service';
import { CreditIncrementDto } from '../../user/dto/credit-increment.dto';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { VServiceInstances } from '../../../../infrastructure/database/entities/views/v-serviceInstances';
import { VServiceInstancesTableService } from '../../crud/v-service-instances-table/v-service-instances-table.service';
import { ServiceTypesEnum } from '../enum/service-types.enum';
import { TemplatesTableService } from '../../crud/templates/templates-table.service';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { VReportsUserTableService } from '../../crud/v-reports-user-table/v-reports-user-table.service';
import { User } from '../../../../infrastructure/database/entities/User';
import axios from 'axios';
import * as process from 'process';
import { TicketService } from '../../ticket/ticket.service';
import { InvoiceAiStrategyService } from '../../invoice/classes/invoice-ai-strategy/invoice-ai-strategy.service';
import { Templates } from '../../../../infrastructure/database/entities/Templates';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly vServiceInstancesTableService: VServiceInstancesTableService,
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
    private readonly invoiceItemsTable: InvoiceItemsTableService,
    private readonly serviceTypesTable: ServiceTypesTableService,
    private readonly vdcService: VdcService,
    private readonly serviceFactory: ServiceServiceFactory,
    private readonly userService: UserService,
    private readonly systemSettingsService: SystemSettingsTableService,
    private readonly templatesTableService: TemplatesTableService,
    private readonly vReportsUserTableService: VReportsUserTableService,
    private readonly ticketService: TicketService,
    private readonly invoiceAiStrategyService: InvoiceAiStrategyService,
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
    invoiceId: number,
    dto: CreditIncrementDto,
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
    return this.userService.creditIncrement(options, dto, invoiceId);
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

  // async verifyZarinpalAuthority(
  //   options: SessionRequest,
  //   authority: string | null = null,
  // ): Promise<ZarinpalVerifyReturnDto> {
  //   const userId = options.user.userId;
  //   // find user transaction
  //   const transaction = await this.transactionsTable.findOne({
  //     where: {
  //       paymentToken: authority,
  //       userId: userId,
  //     },
  //   });
  //   if (transaction === null) {
  //     return Promise.reject(new ForbiddenException());
  //   }
  //   // find user invoice
  //   const invoice = await this.invoicesTable.findOne({
  //     where: {
  //       userId: userId,
  //       id: transaction.invoiceId,
  //     },
  //   });
  //   const paymentRequestData = {
  //     merchant_id: process.env.ZARINPAL_MERCHANT_ID,
  //     amount: transaction.value,
  //     authority: authority,
  //   };
  //   const { verified, refID } =
  //     await this.paymentService.zarinpal.paymentVerify(paymentRequestData);
  //   let serviceInstanceId = null;
  //   let token = null;
  //   let task = null;
  //   let taskId = null;
  //
  //   if (verified && !transaction.isApproved && invoice.type === 1) {
  //     const extendedService =
  //       await this.extendServiceService.extendServiceInstanceAndToken(
  //         options,
  //         invoice,
  //       );
  //     serviceInstanceId = extendedService.serviceInstanceId;
  //     token = extendedService['token'];
  //
  //     // approve user transaction
  //     await this.transactionsTable.updateAll(
  //       {
  //         userId: userId,
  //         invoiceId: invoice.id,
  //       },
  //       {
  //         isApproved: true,
  //         serviceInstanceId: serviceInstanceId,
  //       },
  //     );
  //     // update user invoice
  //     this.invoicesTable.updateAll(
  //       {
  //         userId: userId,
  //         id: transaction.invoiceId,
  //       },
  //       {
  //         payed: true,
  //         serviceInstanceId: serviceInstanceId,
  //       },
  //     );
  //   }
  //   if (verified && !transaction.isApproved && invoice.type === 0) {
  //     // make user service instance
  //
  //     const createdService =
  //       await this.extendServiceService.createServiceInstanceAndToken(
  //         options,
  //         invoice.endDateTime,
  //         invoice.serviceTypeId,
  //         transaction,
  //         invoice.name,
  //         invoice.datacenterName,
  //         invoice.servicePlanType,
  //       );
  //     serviceInstanceId = createdService.serviceInstanceId;
  //     token = createdService['token'];
  //
  //     // options.locals = {
  //     //   ...options.locals,
  //     //   serviceInstanceId,
  //     // };
  //     // approve user transaction
  //     await this.transactionsTable.updateAll(
  //       {
  //         userId: userId,
  //         paymentToken: authority,
  //       },
  //       {
  //         isApproved: true,
  //         serviceInstanceId: serviceInstanceId,
  //       },
  //     );
  //     if (invoice.serviceTypeId === 'vdc') {
  //       task = await this.tasksTable.create({
  //         userId: options.user.userId,
  //         serviceInstanceId: serviceInstanceId,
  //         operation: 'createDataCenter',
  //         details: null,
  //         startTime: new Date(),
  //         endTime: null,
  //         status: 'running',
  //       });
  //       await this.taskManagerService.addTask({
  //         serviceInstanceId,
  //         customTaskId: task.TaskID,
  //         vcloudTask: null,
  //         nextTask: 'createOrg',
  //         requestOptions: {
  //           serviceInstanceId: serviceInstanceId,
  //           userId: options.user.userId,
  //         },
  //         target: 'object',
  //       });
  //       taskId = task.TaskID;
  //     }
  //
  //     if (invoice.serviceTypeId == 'aradAi') {
  //       await this.serviceInstancesTableService.updateAll(
  //         {
  //           id: serviceInstanceId,
  //         },
  //         {
  //           status: 3,
  //         },
  //       );
  //       task = await this.tasksTable.create({
  //         userId: options.user.userId,
  //         serviceInstanceId: serviceInstanceId,
  //         operation: 'aradAi',
  //         details: null,
  //         startTime: new Date(),
  //         endTime: new Date(),
  //         status: 'success',
  //       });
  //       await this.serviceInstancesTableService.updateAll(
  //         {
  //           id: serviceInstanceId,
  //         },
  //         {
  //           status: 3,
  //         },
  //       );
  //       taskId = task.TaskID;
  //     }
  //     // update user invoice
  //     this.invoicesTable.updateAll(
  //       {
  //         userId: userId,
  //         id: transaction.invoiceId,
  //       },
  //       {
  //         payed: true,
  //         serviceInstanceId: serviceInstanceId,
  //       },
  //     );
  //   }
  //
  //   return Promise.resolve({
  //     verified: verified,
  //     refID: refID,
  //     id: serviceInstanceId,
  //     taskId: taskId,
  //     token: token,
  //   });
  // }

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

    //To Do ==> get Config ExtensionDaysLimit from SystemSettings
    const extensionDaysLeft = (
      await this.systemSettingsService.findOne({
        where: { propertyKey: 'ExtensionDaysLimit' },
      })
    ).value;
    const allServicesInstances = await this.getServices(options, typeId, id);
    let cpuSpeed: VcloudMetadata = 0,
      // daysLeft = 0,
      isTicketSent = false,
      vdcItems: GetOrgVdcResult = null;
    let model: GetAllVdcServiceWithItemsResultDto = {};
    for (const serviceInstance of allServicesInstances) {
      const status = this.checkViewingStatusService(serviceInstance.status);

      if (status) {
        cpuSpeed = (
          await this.serviceFactory.getConfigServiceInstance(serviceInstance)
        ).cpuSpeed;

        vdcItems = await this.vdcService.getVdc(options, serviceInstance.id);
      }
      // if (vdcItems != null) {
      const info = ({ isTicketSent } =
        await this.serviceFactory.getPropertiesOfServiceInstance(
          serviceInstance,
        ));
      // (daysLeft = info.daysLeft),
      isTicketSent = info.isTicketSent;
      model = await this.serviceFactory.configModelServiceInstanceList(
        serviceInstance,
        options,
        isTicketSent,
        vdcItems,
        cpuSpeed,
        Number(extensionDaysLeft),
      );

      res.push(model);
      // }
    }

    return res;
  }

  private checkViewingStatusService(status: number) {
    return (
      status != ServiceStatusEnum.Error &&
      status != ServiceStatusEnum.Deleted &&
      status != ServiceStatusEnum.Pending
    );
  }

  async getServices(
    options: SessionRequest,
    typeId?: string,
    id?: string,
    statuses?: ServiceStatusEnum[],
  ): Promise<GetServicesReturnDto[]> {
    const {
      user: { userId },
    } = options;
    let serviceTypeIds = ['vdc', 'vgpu', 'aradAi'];
    let serviceStatus: ServiceStatusEnum[] = [
      // 3, 4, 5, 6, 7, 8
      ServiceStatusEnum.Deleted,
      ServiceStatusEnum.Error,
      ServiceStatusEnum.DisabledByAdmin,
      ServiceStatusEnum.Success,
      ServiceStatusEnum.Expired,
      ServiceStatusEnum.Pending,
      ServiceStatusEnum.Disabled,
      ServiceStatusEnum.ExceededEnoughCredit,
      ServiceStatusEnum.Upgrading,
    ];
    if (typeId) {
      serviceTypeIds = [typeId];
    }
    if (statuses) {
      serviceStatus = statuses;
    }
    const where: FindOptionsWhere<VServiceInstances> = {
      userId: userId,
      isDeleted: false,
      serviceTypeId: In(serviceTypeIds),
      status: In(serviceStatus),
    };
    if (id) {
      where.id = id;
    }

    const services: VServiceInstances[] =
      await this.vServiceInstancesTableService.find({
        where,
        relations: ['serviceItems', 'serviceType', 'vServiceItems'],
        order: {
          createDate: { direction: 'DESC' },
          status: { direction: 'ASC' },
        },
      });

    const extendedServiceList = services.map((service) => {
      const expired =
        new Date(service.expireDate).getTime() <= new Date().getTime();
      return {
        ...service,
        expired: expired,
        retryCount: service.retryCount,
        daysLeft: service.daysLeft,
        createDate: service.createDate,
        credit: service.credit,
      };
    });
    return extendedServiceList;
  }

  async getTemplates(
    options: SessionRequest,
    serviceType: ServiceTypesEnum,
    servicePlanType: ServicePlanTypeEnum = ServicePlanTypeEnum.Static,
  ): Promise<Templates[]> {
    const serviceTypeDB = await this.serviceTypesTable.findOne({
      where: {
        id: serviceType,
      },
    });
    const templates = await this.templatesTableService.find({
      where: {
        serviceType: { id: serviceTypeDB.id },
        servicePlanType: servicePlanType,
      },
      order: {
        period: 'asc',
        sort: 'asc',
      },
    });

    if (serviceType == ServiceTypesEnum.Ai) {
      return await Promise.all(
        templates.map(async (template: Templates): Promise<Templates> => {
          template.structure = JSON.parse(template.structure);
          const prices =
            await this.invoiceAiStrategyService.calculateTemplatePrice(
              template.guid,
            );
          template.structure['rawPrice'] = prices.rawAmount;
          template.structure['finalPrice'] = prices.finalAmount;

          return template;
        }),
      );
    } else {
      templates.forEach((template) => {
        template.structure = JSON.parse(template.structure);
      });

      return templates;
    }
  }

  async getReports(option: SessionRequest) {
    const userId = option.user.userId;
    const res = await this.vReportsUserTableService.findOne({
      where: { userId: userId },
    });

    const ticketCount = (await this.ticketService.getAllTickets(option))
      ?.tickets?.length;

    return {
      unpaidInvoices: res?.activeInvoices,
      activeTickets: ticketCount,
      servicesExpiringCount: res?.serviceExpiredCount,
      servicesBudgetCount: res?.serviceNeedBudgetCount,
    };
  }

  async getAiServices(option: SessionRequest) {
    const user: User = await this.userService.findById(option.user.userId);

    const services: ServiceInstances[] =
      await this.serviceInstancesTableService.find({
        where: {
          userId: user.id,
          status: 3,
          serviceTypeId: ServiceTypesEnum.Ai,
          isDeleted: false,
        },
      });
    console.log(services);
    if (services.length == 0) {
      return [];
    }

    const axiosConfig = {
      headers: {
        Authorization: process.env.AI_BACK_TOKEN,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const aiUrl =
      process.env.AI_BACK_URL + '/api/Cloud/UserQaLists/' + user.phoneNumber;

    const getListRequest = await axios.get(aiUrl, axiosConfig);

    return getListRequest.data;
  }
}
