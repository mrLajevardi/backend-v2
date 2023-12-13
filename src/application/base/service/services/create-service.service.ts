import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
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
import { ServiceTypes } from 'src/infrastructure/database/entities/ServiceTypes';
import { ServiceTypesEnum } from '../enum/service-types.enum';
import { InvoiceTypes } from '../../invoice/enum/invoice-type.enum';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { TaskManagerService } from '../../task-manager/service/task-manager.service';
import { TasksEnum } from '../../task-manager/enum/tasks.enum';
import { ServiceStatusEnum } from '../enum/service-status.enum';
import { TicketingWrapperService } from 'src/wrappers/uvdesk-wrapper/service/wrapper/ticketing-wrapper.service';
import { ActAsTypeEnum } from 'src/wrappers/uvdesk-wrapper/service/wrapper/enum/act-as-type.enum';
import { TicketsSubjectEnum } from '../../ticket/enum/tickets-subject.enum';
import { TicketsMessagesEnum } from '../../ticket/enum/tickets-message.enum';
import { ServiceServiceFactory } from '../Factory/service.service.factory';

@Injectable()
export class CreateServiceService {
  constructor(
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
  ) {}

  async createService(
    options: SessionRequest,
    dto: CreateServiceDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const { invoiceId } = dto;
    // find user invoice
    const invoice = await this.InvoiceTableService.findOne({
      where: {
        id: invoiceId,
        userId,
      },
    });
    if (invoice === null) {
      throw new ForbiddenException();
    }
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
    const transaction = await this.transactionTableService.create({
      dateTime: new Date(),
      description: '',
      invoiceId: invoice.id,
      isApproved: null,
      value: -invoice.finalAmount,
      paymentToken: null,
      paymentType: PaymentTypes.PayByCredit,
      serviceInstanceId: null,
      userId: options.user.userId.toString(),
    });
    // invoice is not paid
    const checkCredit = await this.userService.checkUserCredit(
      invoice.finalAmount,
      userId,
      options,
      invoice.serviceTypeId,
    );
    if (!checkCredit) {
      this.transactionTableService.update(transaction.id, {
        isApproved: false,
      });
      throw new NotEnoughCreditException();
    }
    this.transactionTableService.update(transaction.id, {
      isApproved: true,
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
      // options.locals = {
      //   ...options.locals,
      //   serviceInstanceId,
      // };
      // approve user transaction
      await this.transactionTableService.updateAll(
        {
          userId: userId,
          invoiceId,
        },
        {
          isApproved: true,
          serviceInstanceId,
        },
      );
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
      await this.ticketingWrapperService.createTicket(
        TicketsMessagesEnum.VdcCreationFailure,
        ActAsTypeEnum.User,
        null,
        user.name,
        TicketsSubjectEnum.AutomaticTicket,
        user.username,
      );
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
