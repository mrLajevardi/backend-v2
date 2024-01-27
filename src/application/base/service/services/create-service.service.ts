import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { UserService } from 'src/application/base/user/service/user.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { ExtendServiceService } from './extend-service.service';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService as oldTaskManager } from '../../tasks/service/task-manager.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { Discounts } from 'src/infrastructure/database/entities/Discounts';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { UpdateServiceInstancesDto } from '../../crud/service-instances-table/dto/update-service-instances.dto';
import { ServiceTypesEnum } from '../enum/service-types.enum';
import { InvoiceTypes } from '../../invoice/enum/invoice-type.enum';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { TaskManagerService } from '../../task-manager/service/task-manager.service';
import { TasksEnum } from '../../task-manager/enum/tasks.enum';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { TicketingWrapperService } from 'src/wrappers/uvdesk-wrapper/service/wrapper/ticketing-wrapper.service';
import { TicketsSubjectEnum } from '../../ticket/enum/tickets-subject.enum';
import { TicketsMessagesEnum } from '../../ticket/enum/tickets-message.enum';
import { ServiceServiceFactory } from '../Factory/service.service.factory';
import { UserInfoService } from '../../user/service/user-info.service';
import { Invoices } from '../../../../infrastructure/database/entities/Invoices';
import { Transactions } from '../../../../infrastructure/database/entities/Transactions';
import { CreateServiceInstancesDto } from '../../crud/service-instances-table/dto/create-service-instances.dto';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { ItemTypeCodes } from '../../itemType/enum/item-type-codes.enum';
import { InvoiceItems } from '../../../../infrastructure/database/entities/InvoiceItems';
import { addMonths } from '../../../../infrastructure/helpers/date-time.helper';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { ServiceInstances } from '../../../../infrastructure/database/entities/ServiceInstances';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { Tasks } from '../../../../infrastructure/database/entities/Tasks';
import axios from 'axios';
import * as process from 'process';
import { User } from '../../../../infrastructure/database/entities/User';
import { AiApiException } from '../../../../infrastructure/exceptions/ai-api.exception';
import { TicketService } from '../../ticket/ticket.service';
import { BaseFactoryException } from '../../../../infrastructure/exceptions/base/base-factory.exception';

@Injectable()
export class CreateServiceService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly transactionTableService: TransactionsTableService,
    private readonly InvoiceTableService: InvoicesTableService,
    private readonly extendService: ExtendServiceService,
    private readonly tasksTableService: TasksTableService,
    private readonly taskManagerService: oldTaskManager,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly vgpuService: VgpuService,
    private readonly discountsTable: DiscountsTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly newTaskManagerService: TaskManagerService,
    private readonly ticketingWrapperService: TicketingWrapperService,
    private readonly serviceFactory: ServiceServiceFactory,
    private readonly userInfoService: UserInfoService,
    private readonly serviceTypesTableService: ServiceTypesTableService,
    private readonly serviceItemsTableService: ServiceItemsTableService,
    private readonly invoicesTableService: InvoicesTableService,
    private readonly ticketService: TicketService,
    private readonly baseFactoryException: BaseFactoryException,
    private dataSource: DataSource,
  ) {}

  private strategy: any = {
    [ServiceTypesEnum.Vdc]: this.createVdcService,
    [ServiceTypesEnum.Ai]: this.createAiService,
  };

  async createService(
    options: SessionRequest,
    dto: CreateServiceDto,
  ): Promise<TaskReturnDto> {
    const invoice: Invoices = await this.InvoiceTableService.findOne({
      where: {
        id: dto.invoiceId,
      },
      relations: ['invoiceItems'],
    });

    if (isNil(invoice) || invoice.userId != options.user.userId) {
      throw new ForbiddenException();
    }

    return await this.strategy[invoice.serviceTypeId].bind(this)(
      options,
      invoice,
    );
  }

  async createAiService(
    options: SessionRequest,
    invoice: Invoices,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!isNil(invoice.serviceInstanceId)) {
        return {
          id: invoice.serviceInstanceId,
          taskId: null,
        };
      }
      const userId = options.user.userId;
      const userCredit = await this.userInfoService.getUserCreditBy(userId);
      const user: User = await this.userService.findById(userId);
      if (userCredit < invoice.finalAmountWithTax) {
        this.baseFactoryException.handle(NotEnoughCreditException);
      }

      const transaction: Transactions = await queryRunner.manager.save(
        Transactions,
        {
          dateTime: new Date(),
          description: '',
          invoiceId: invoice.id,
          isApproved: false,
          value: -invoice.finalAmountWithTax,
          paymentToken: null,
          paymentType: PaymentTypes.PayByCredit,
          serviceInstanceId: null,
          userId: userId,
        },
      );

      const serviceType = await this.serviceTypesTableService.findOne({
        where: {
          id: ServiceTypesEnum.Ai,
        },
      });

      const periodItem: InvoiceItems = invoice.invoiceItems.find((item) =>
        item.codeHierarchy.includes(ItemTypeCodes.Period),
      );

      const requestNumber: InvoiceItems = invoice.invoiceItems.find((item) =>
        item.codeHierarchy.includes(ItemTypeCodes.RequestNumber),
      );

      if (isNil(periodItem)) {
        return new ForbiddenException();
      }

      const endDate = addMonths(new Date(), Number(periodItem.value));

      const serviceInstanceDto: CreateServiceInstancesDto = {
        name: invoice.name,
        servicePlanType: invoice.servicePlanType,
        datacenterName: invoice.datacenterName,
        createDate: new Date(),
        expireDate: endDate,
        serviceType: serviceType,
        status: 1,
        userId: invoice.userId,
        lastUpdateDate: new Date(),
      };

      const serviceInstance: ServiceInstances = await queryRunner.manager.save(
        ServiceInstances,
        serviceInstanceDto,
      );

      const serviceInstanceId = serviceInstance.id;
      const serviceItemsDto: CreateServiceItemsDto[] = invoice.invoiceItems.map(
        (item) => {
          return {
            serviceInstanceId: serviceInstanceId,
            itemTypeId: item.itemId,
            itemTypeCode: item.codeHierarchy,
            value: item.value,
            quantity: item.quantity,
          } as CreateServiceItemsDto;
        },
      );

      await queryRunner.manager.insert(ServiceItems, serviceItemsDto);

      await queryRunner.manager.update(
        Transactions,
        {
          id: transaction.id,
        },
        {
          isApproved: true,
          serviceInstanceId: serviceInstanceId,
        },
      );

      const task: Tasks = await queryRunner.manager.save(Tasks, {
        userId: options.user.userId,
        serviceInstanceId: serviceInstanceId,
        operation: ServiceTypesEnum.Ai,
        details: null,
        startTime: new Date(),
        endTime: new Date(),
        status: 'success',
      });

      await queryRunner.manager.update(
        ServiceInstances,
        {
          id: serviceInstanceId,
        },
        {
          status: 3,
        },
      );

      await queryRunner.manager.update(
        Invoices,
        {
          id: invoice.id,
        },
        {
          serviceInstanceId: serviceInstanceId,
          payed: true,
        },
      );
      const aiGetUserIdUrl = process.env.AI_BACK_URL + '/api/Auth/LoginAs';

      const axiosConfig = {
        headers: {
          Authorization: process.env.AI_BACK_TOKEN,
          'Access-Control-Allow-Origin': '*',
        },
      };

      const aiGetUserIdRequest = await axios.post(
        aiGetUserIdUrl,
        {
          phoneNumber: user.phoneNumber,
        },
        axiosConfig,
      );

      const aiUserId: number = aiGetUserIdRequest.data.userId;
      const aiUserToken = aiGetUserIdRequest.data.token;
      const aiCreateServiceUrl = process.env.AI_BACK_URL + '/api/Cloud/QaList';

      const aiCreateServiceData = {
        name: invoice.name,
        description: invoice.description,
        robotName: 'پشتیبان هوشمند',
        robotRole: 'پاسخگویی خودکار به سولات کاربران',
        robotDomain: 'دامنه سوالات به عنوان نمونه: مشکلات رایج در رژیم کتوژنیک',
        iDontKnowResponse:
          'به این سوال نمی توانم پاسخ دهم. لطفا دقیق تر بپرسید.',
        userId: aiUserId,
        version: 'v2',
        language: 'fa',
        welcomeMessage: 'سلام. وقت به خیر.',
        requestLimit: requestNumber.value,
        expiration: serviceInstance.expireDate,
      };

      const createQaList = await axios.post(
        aiCreateServiceUrl,
        aiCreateServiceData,
        axiosConfig,
      );

      if (![200, 201].includes(createQaList.status)) {
        this.baseFactoryException.handle(AiApiException);
      }

      const taskId = task.taskId;

      await queryRunner.commitTransaction();

      return {
        taskId: taskId,
        id: serviceInstanceId,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async createVdcService(
    options: SessionRequest,
    invoice: Invoices,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const invoiceId = invoice.id;

    await this.serviceFactory.checkResources(invoice.id);
    let serviceInstanceId = null;
    let task = null;
    let taskId = null;
    if (invoice.payed) {
      return Promise.resolve({
        id: serviceInstanceId,
        taskId: taskId,
        token: null,
      });
    }

    const userCredit = await this.userInfoService.getUserCreditBy(userId);

    let checkCredit = false;

    if (userCredit < invoice.finalAmountWithTax) {
      this.baseFactoryException.handle(NotEnoughCreditException);
    } else {
      checkCredit = true;
    }
    const transaction = await this.transactionTableService.create({
      dateTime: new Date(),
      description: '',
      invoiceId: invoice.id,
      isApproved: false,
      value: -invoice.finalAmountWithTax,
      paymentToken: null,
      paymentType: PaymentTypes.PayByCredit,
      serviceInstanceId: null,
      userId: options.user.userId.toString(),
    });

    // extend last user service instance
    if (checkCredit && invoice.type === InvoiceTypes.Extend) {
      const extendedService =
        await this.extendService.extendServiceInstanceAndToken(
          options,
          invoice,
        );
      await this.extendService.upgradeService(
        invoice.serviceInstanceId,
        invoiceId,
        invoice.type,
      );
      serviceInstanceId = extendedService.serviceInstanceId;
      await this.extendService.approveTransactionAndInvoice(
        invoice,
        transaction,
      );
    }
    if (checkCredit && invoice.type === InvoiceTypes.UpgradeAndExtend) {
      const extendedService =
        await this.extendService.extendServiceInstanceAndToken(
          options,
          invoice,
        );
      serviceInstanceId = extendedService.serviceInstanceId;
      const service = await this.serviceInstancesTable.findById(
        invoice.serviceInstanceId,
      );
      await this.extendService.upgradeService(
        invoice.serviceInstanceId,
        invoiceId,
        invoice.type,
      );
      if (service.serviceTypeId === ServiceTypesEnum.Vdc) {
        const task = await this.newTaskManagerService.createFlow(
          TasksEnum.UpgradeVdc,
          invoice.serviceInstanceId,
        );
        taskId = task.taskId;
      }
      await this.extendService.approveTransactionAndInvoice(
        invoice,
        transaction,
      );
    }
    // creating new service instance
    if (checkCredit && invoice.type === InvoiceTypes.Create) {
      // make user service instance
      const createdService =
        await this.extendService.createServiceInstanceAndToken(
          options,
          invoice.endDateTime,
          invoice.serviceTypeId,
          transaction,
          invoice.name,
          invoice.datacenterName,
          invoice.servicePlanType,
        );
      serviceInstanceId = createdService.serviceInstanceId;

      await this.transactionTableService.update(transaction.id, {
        isApproved: true,
        serviceInstanceId: serviceInstanceId,
      });

      if (invoice.serviceTypeId === ServiceTypesEnum.Vdc) {
        task = await this.tasksTableService.create({
          userId: userId,
          serviceInstanceId,
          operation: 'createDataCenter',
          details: null,
          startTime: new Date(),
          endTime: null,
          status: 'running',
        });
        await this.taskManagerService.addTask({
          serviceInstanceId,
          customTaskId: task.taskId,
          vcloudTask: null,
          nextTask: 'createOrg',
          requestOptions: {
            ...options.user,
            serviceInstanceId: serviceInstanceId,
          },
          target: 'object',
        });
        taskId = task.taskId;
      }
      if (invoice.serviceTypeId === 'vgpu') {
        taskId = await this.vgpuService.createVgpu(
          options.user.userId,
          invoiceId,
          serviceInstanceId,
          options,
        );
      }
      if (invoice.serviceTypeId == 'aradAi') {
        task = await this.tasksTableService.create({
          userId: options.user.userId,
          serviceInstanceId: serviceInstanceId,
          operation: 'aradAi',
          details: null,
          startTime: new Date(),
          endTime: new Date(),
          status: 'success',
        });
        await this.serviceInstancesTable.updateAll(
          {
            id: serviceInstanceId,
          },
          {
            status: 3,
          },
        );
        taskId = task.taskId;
      }
      // update user invoice
      await this.InvoiceTableService.updateAll(
        {
          userId: userId,
          id: invoice.id,
        },
        {
          serviceInstanceId,
          payed: true,
        },
      );
    }
    if (checkCredit && invoice.type === InvoiceTypes.Upgrade) {
      const service = await this.serviceInstancesTable.findById(
        invoice.serviceInstanceId,
      );
      await this.extendService.upgradeService(
        invoice.serviceInstanceId,
        invoiceId,
        invoice.type,
      );
      if (service.serviceTypeId === ServiceTypesEnum.Vdc) {
        const task = await this.newTaskManagerService.createFlow(
          TasksEnum.UpgradeVdc,
          invoice.serviceInstanceId,
        );
        taskId = task.taskId;
      }
      this.InvoiceTableService.updateAll(
        {
          userId: userId,
          id: invoice.id,
        },
        {
          payed: true,
          serviceInstanceId: invoice.serviceInstanceId,
        },
      );
    }

    return Promise.resolve({
      id: serviceInstanceId,
      taskId: taskId,
      token: null,
    });
    // update user invoice
  }

  async repairService(
    options: SessionRequest,
    serviceInstanceId: string,
  ): Promise<TaskReturnDto> {
    const service = await this.serviceInstancesTableService.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    const user = await this.userService.findById(options.user.userId);
    const retryCount = service.retryCount === null ? 0 : service.retryCount;
    if (service.status !== ServiceStatusEnum.Error || retryCount > 2) {
      throw new BadRequestException();
    }
    if (retryCount === 1) {
      await this.ticketService.createTicket(options, {
        subject: TicketsSubjectEnum.AutomaticTicket,
        message: TicketsMessagesEnum.VdcCreationFailure,
        name: user.name,
        serviceInstanceId,
      });
    }
    const task = await this.tasksTableService.create({
      userId: options.user.userId,
      serviceInstanceId: serviceInstanceId,
      operation: 'createDataCenter',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    await this.serviceInstancesTableService.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 1,
        retryCount: retryCount + 1,
      },
    );
    await this.taskManagerService.addTask({
      serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      nextTask: 'createOrg',
      target: 'object',
      requestOptions: options.user,
    });
    return Promise.resolve({
      taskId: task.taskId,
    });
  }

  async updateServiceInfo(
    serviceInstanceId: string,
    data: UpdateServiceInstancesDto,
  ): Promise<void> {
    const { name } = data;
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        name: name,
      },
    );
  }

  async getDiscounts(filter: string): Promise<Discounts[]> {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const discounts = await this.discountsTable.find(parsedFilter);
    return Promise.resolve(discounts);
  }

  async getItemTypes(filter: string): Promise<ItemTypes[]> {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const itemTypes = await this.itemTypesTable.find(parsedFilter);
    return Promise.resolve(itemTypes);
  }
}
