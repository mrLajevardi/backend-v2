import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { ServiceChecksService } from './service-checks.service';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { InvalidDiscountIdException } from 'src/infrastructure/exceptions/invalid-discount-id.exception';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import Costs from '../classes/costs';

import { AiService } from 'src/application/ai/ai.service';
import { ServiceItemsSumService } from 'src/application/base/crud/service-items-sum/service-items-sum.service';
import { UserService } from 'src/application/base/user/service/user.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { importScript } from 'src/infrastructure/helpers/import-script.helper';
import { CreateServiceInstancesDto } from '../../crud/service-instances-table/dto/create-service-instances.dto';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { QualityPlansService } from '../../crud/quality-plans/quality-plans.service';
import { DiscountsService } from './discounts.service';
import { ServiceService } from './service.service';
import { ExtendServiceService } from './extend-service.service';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { CreateServiceDto } from '../dto/create-service.dto';

@Injectable()
export class CreateServiceService {
  constructor(
    private readonly userService: UserService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly transactionTableService: TransactionsTableService,
    private readonly InvoiceTableService: InvoicesTableService,
    private readonly extendService: ExtendServiceService,
    private readonly tasksTableService: TasksTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly vgpuService: VgpuService,
    private readonly discountsTable: DiscountsTableService,
    private readonly itemTypesTable: ItemTypesTableService,
  ) {}

  async createService(options, dto: CreateServiceDto) {
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
    // find user transaction
    const transaction = await this.transactionTableService.findOne({
      where: {
        invoiceId,
        userId,
      },
    });
    if (transaction === null) {
      throw new ForbiddenException();
    }
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
    // invoice is not paid
    const checkCredit = await this.userService.checkUserCredit(
      transaction.value,
      userId,
      options,
      invoice.serviceTypeId,
    );
    if (!checkCredit) {
      throw new NotEnoughCreditException();
    }
    // extend last user service instance
    if (checkCredit && !transaction.isApproved && invoice.type === 1) {
      const extendedService =
        await this.extendService.extendServiceInstanceAndToken(
          options,
          invoice,
        );
      serviceInstanceId = extendedService.serviceInstanceId;
      await this.extendService.approveTransactionAndInvoice(
        invoice,
        transaction,
      );
    }

    // creating new service instance
    if (checkCredit && !transaction.isApproved && invoice.type === 0) {
      // make user service instance
      const createdService =
        await this.extendService.createServiceInstanceAndToken(
          options,
          invoice.endDateTime,
          invoice.serviceTypeId,
          transaction,
          invoice.name,
        );
      serviceInstanceId = createdService.serviceInstanceId;
      options.locals = {
        ...options.locals,
        serviceInstanceId,
      };
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
      if (invoice.serviceTypeId === 'vdc') {
        task = await this.tasksTableService.create({
          userId: userId,
          serviceInstanceId,
          operation: 'createDataCenter',
          details: null,
          startTime: new Date(),
          endTime: null,
          status: 'running',
        });
        console.log(taskId);
        await this.taskManagerService.addTask({
          serviceInstanceId,
          customTaskId: task.taskId,
          vcloudTask: null,
          nextTask: 'createOrg',
          requestOptions: options.locals,
          target: 'object',
        });
        taskId = task.taskId;
      }
      if (invoice.serviceTypeId === 'vgpu') {
        taskId = await this.vgpuService.createVgpu(
          options.locals.userId,
          invoiceId,
          serviceInstanceId,
          options,
        );
      }
      if (invoice.serviceTypeId == 'aradAi') {
        task = await this.tasksTableService.create({
          userId: options.locals.userId,
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
      this.InvoiceTableService.updateAll(
        {
          userId: userId,
          id: transaction.invoiceId,
        },
        {
          payed: true,
          serviceInstanceId: serviceInstanceId,
        },
      );
    } else if (checkCredit && !transaction.isApproved && invoice.type === 2) {
      // const service = await increaseServiceResources(app, options, invoice);
      // serviceInstanceId = service.ID;
      // const args = {
      //   invoiceId: invoice.ID,
      // };
      // const stringifiedArgs = JSON.stringify(args);
      // if (service.ServiceTypeID == 'vdc') {
      //   const task = await taskManager.createFlow(
      //     'increaseVdcResources',
      //     service.ID,
      //     stringifiedArgs,
      //   );
      //   taskId = task.TaskID;
      // }
      // await createExtendService.approveTransactionAndInvoice(
      //   app,
      //   invoice,
      //   transaction,
      // );
    }
    return Promise.resolve({
      id: serviceInstanceId,
      taskId: taskId,
      token: null,
    });
  }
  async repairService(options, serviceInstanceId) {
    const service = await this.serviceInstancesTableService.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    if (service.status === 1 || service.status === 3) {
      throw new BadRequestException();
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
      },
    );
    await this.taskManagerService.addTask({
      serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      nextTask: 'createOrg',
      target: 'object',
      requestOptions: options.locals,
    });
    return Promise.resolve({
      taskId: task.taskId,
    });
  }

  async updateServiceInfo(serviceInstanceId, data) {
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

  async getDiscounts(filter) {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const discounts = await this.discountsTable.find(parsedFilter);
    return Promise.resolve(discounts);
  }

  async getItemTypes(filter) {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }
    const itemTypes = await this.itemTypesTable.find(parsedFilter);
    return Promise.resolve(itemTypes);
  }
}
