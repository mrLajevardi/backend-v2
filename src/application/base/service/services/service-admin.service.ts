import { HttpStatus, Injectable } from "@nestjs/common";
import { ServiceInstancesTableService } from "../../crud/service-instances-table/service-instances-table.service";
import { SessionsService } from "../../sessions/sessions.service";
import { TaskManagerService } from "../../tasks/service/task-manager.service";
import { mainWrapper } from "src/wrappers/mainWrapper/mainWrapper";
import { ConflictException } from "src/infrastructure/exceptions/conflict.exception";
import { TasksTableService } from "../../crud/tasks-table/tasks-table.service";
import { isEmpty, isNil } from "lodash";
import { ServiceIsDeployException } from "src/infrastructure/exceptions/service-is-deploy.exception";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { ConfigsTableService } from "../../crud/configs-table/configs-table.service";
import { ForbiddenException } from "src/infrastructure/exceptions/forbidden.exception";
import { DisabledServiceException } from "src/infrastructure/exceptions/disabled-service.exception";
import { NotDisabledServiceException } from "src/infrastructure/exceptions/not-disabled-service.exception";
import { BadRequestException } from "src/infrastructure/exceptions/bad-request.exception";
import { ItemTypesTableService } from "../../crud/item-types-table/item-types-table.service";
import { ServiceItemsSumService } from "../../crud/service-items-sum/service-items-sum.service";
import { ServiceReportsViewService } from "../../crud/service-reports-view/service-reports-view.service";
import { InvoicesTableService } from "../../crud/invoices-table/invoices-table.service";
import { TransactionsTableService } from "../../crud/transactions-table/transactions-table.service";
import { Transactions } from "src/infrastructure/database/entities/Transactions";
import { NotFoundException } from "src/infrastructure/exceptions/not-found.exception";
import { VgpuService } from "src/application/vgpu/vgpu.service";
import { UpdateItemTypesDto } from "../../crud/item-types-table/dto/update-item-types.dto";
import { VdcResourceLimitsDto } from "../dto/vdc-resource-limits.dto";
import { ServiceInstances } from "src/infrastructure/database/entities/ServiceInstances";
import { ServicePropertiesService } from "../../service-properties/service-properties.service";
import { SessionRequest } from "src/infrastructure/types/session-request.type";
import { TaskReturnDto } from "src/infrastructure/dto/task-return.dto";
import { Tasks } from "src/infrastructure/database/entities/Tasks";
import { PaginationReturnDto } from "src/infrastructure/dto/pagination-return.dto";
import { Configs } from "src/infrastructure/database/entities/Configs";
import { ItemTypes } from "src/infrastructure/database/entities/ItemTypes";
import { RequestOptions } from "https";
import { ServiceReports } from "src/infrastructure/database/entities/views/service-reports";
import { Invoices } from "src/infrastructure/database/entities/Invoices";
import { ServiceTypes } from "src/infrastructure/database/entities/ServiceTypes";
import { UpdateConfigsDto } from "../../crud/configs-table/dto/update-configs.dto";
import { FindOptionsWhere, ILike, Like, Not } from "typeorm";

@Injectable()
export class ServiceAdminService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly sessionService: SessionsService,
    private readonly taskManagerService: TaskManagerService,
    private readonly tasksTable: TasksTableService,
    private readonly logger: LoggerService,
    private readonly configsTable: ConfigsTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly serviceItemsSumTable: ServiceItemsSumService,
    private readonly serviceReportsTable: ServiceReportsViewService,
    private readonly invoicesTable: InvoicesTableService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly vgpuService: VgpuService,
    private readonly servicePropertiesService: ServicePropertiesService
  ) {}

  async deleteService(
    options: SessionRequest,
    serviceInstanceId: string
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const serviceInstance = await this.serviceInstancesTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    let nextDeleteTask = null;
    let logAction = null;

    const serviceTypeId = serviceInstance.serviceTypeId;
    if (serviceInstance.status === 1) {
      const error = new Error("Unable to delete " + serviceTypeId);
      error["statusCode"] = HttpStatus.BAD_REQUEST;
      error["code"] = "RUNNING_" + serviceTypeId.toUpperCase() + "_SERVICE";
      return Promise.reject(error);
    }
    if (serviceTypeId == "vdc") {
      const adminSession = await this.sessionService.checkAdminSession(userId);
      const query = await mainWrapper.user.vdc.vcloudQuery(adminSession, {
        filter: `((name==networkEdgeGatewayDelete),(name==vdcDeleteVdc));((status==queued),(status==running))`,
        type: "adminTask",
      });
      if (query.data.record.length > 0) {
        return Promise.reject(new ConflictException());
      }

      nextDeleteTask = "deleteCatalogOrg";
    }
    const task = await this.tasksTable.create({
      userId: userId,
      serviceInstanceId: serviceInstanceId,
      operation: "delete" + serviceTypeId.toUpperCase() + "Service",
      details: null,
      startTime: new Date(),
      endTime: null,
      status: "running",
    });
    let logType = serviceTypeId;
    if (serviceTypeId === "aradAi") {
      nextDeleteTask = "finishDeleteService";
      logType = "aradAI";
      logAction = "deleteAradAi";
    }
    if (serviceTypeId == "vgpu") {
      // check if power off
      const props = {};
      const VgpuConfigs = await this.configsTable.find({
        where: {
          propertyKey: Like("%config.vgpu.%"),
        },
      });
      for (const prop of VgpuConfigs) {
        const key = prop.propertyKey.split(".").slice(-1)[0];
        const item = prop.value;
        props[key] = item;
      }
      const vmName = serviceInstanceId + "VM";
      const vdcIdVgpu = props["vdcId"].split(":").slice(-1);
      //const session = await this.sessionService.checkAdminSession(userId,props['orgId']);
      const session = await this.sessionService.checkUserSession(
        userId,
        props["orgId"]
      );
      const vmInfo = await this.vgpuService.getVmsInfo(
        session,
        vdcIdVgpu,
        props["orgId"],
        props["orgName"],
        `name==${vmName}`
      );
      if (!isEmpty(vmInfo) && vmInfo[0].isDeployed === true) {
        const err = new ServiceIsDeployException();
        return Promise.reject(err);
      }
      nextDeleteTask = "deleteVgpu";
      logAction = nextDeleteTask;
    }

    if (serviceTypeId == "vdc") {
      nextDeleteTask = "deleteCatalogOrg";
      logAction = "deleteVdc";
    }
    await this.taskManagerService.addTask({
      serviceInstanceId: serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      target: "task",
      nextTask: nextDeleteTask,
      taskType: "adminTask",
      requestOptions: options,
    });
    await this.logger.info(
      logType,
      logAction,
      { _object: serviceInstanceId },
      options.user
    );
    return Promise.resolve({
      id: serviceInstanceId,
      taskId: task.taskId,
    });
  }

  async disableService(
    options: SessionRequest,
    serviceInstanceId: string
  ): Promise<TaskReturnDto> {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId
    );
    const { serviceTypeId: serviceType } = service;
    if (isNil(service)) {
      return Promise.reject(new ForbiddenException());
    }
    console.log(service);
    if (service.status === 4 && service.isDisabled) {
      const error = new DisabledServiceException("service is already disabled");
    }
    let task: Tasks;
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 4,
      }
    );
    if (serviceType === "vdc") {
      const props = await this.servicePropertiesService.getAllServiceProperties(
        service.id
      );
      const session = await this.sessionService.checkAdminSession(
        service.userId
      );
      await mainWrapper.admin.vdc.disableVdc(session, props["vdcId"]);
      task = await this.tasksTable.create({
        userId: service.userId,
        serviceInstanceId: serviceInstanceId,
        operation: "disable" + service.serviceTypeId.toUpperCase() + "Service",
        details: null,
        startTime: new Date(),
        endTime: null,
        status: "running",
      });
      await this.taskManagerService.addTask({
        serviceInstanceId: service.id,
        customTaskId: task.taskId,
        requestOptions: {},
        vcloudTask: null,
        nextTask: "disableVms",
        target: "object",
      });
    } else {
      task = await this.tasksTable.create({
        userId: service.userId,
        serviceInstanceId: serviceInstanceId,
        operation: "disable" + service.serviceTypeId.toUpperCase() + "Service",
        details: null,
        startTime: new Date(),
        endTime: new Date(),
        status: "success",
      });
    }
    await this.logger.info(
      "services",
      "disableService",
      {
        serviceType,
        _object: null,
      },
      { ...options.user }
    );
    console.log(task, "😘👌👌");
    return Promise.resolve({
      taskId: task.taskId,
      id: serviceInstanceId,
    });
  }

  async enableService(options: SessionRequest, serviceInstanceId: string) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId
    );
    const { serviceTypeId: serviceType } = service;
    if (isNil(service)) {
      return Promise.reject(new ForbiddenException());
    }
    if (service.status !== 4) {
      const error = new NotDisabledServiceException("service is not disabled");
    }
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 3,
        isDisabled: 0, // false
      }
    );
    if (serviceType === "vdc") {
      const props = await this.servicePropertiesService.getAllServiceProperties(
        service.id
      );
      const session = await this.sessionService.checkAdminSession(
        service.userId
      );
      await mainWrapper.admin.vdc.enableVdc(props["vdcId"], session);
    }
    const task = await this.tasksTable.create({
      userId: service.userId,
      serviceInstanceId: serviceInstanceId,
      operation: "enable" + service.serviceTypeId.toUpperCase() + "Service",
      details: null,
      startTime: new Date(),
      endTime: new Date(),
      status: "success",
    });
    await this.logger.info(
      "services",
      "enableService",
      {
        serviceType,
        _object: null,
      },
      { ...options.user }
    );
    console.log({
      taskId: task,
      id: serviceInstanceId,
    });
    return Promise.resolve({
      taskId: task.taskId,
      id: serviceInstanceId,
    });
  }

  async getConfigs(
    options: SessionRequest,
    page: number,
    pageSize: number,
    serviceTypeId: string,
    key: string,
    value: string
  ): Promise<PaginationReturnDto<Configs>> {
    if (pageSize > 128) {
      return Promise.reject(new BadRequestException());
    }
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }
    const where = isNil(serviceTypeId || key || value)
      ? {}
      : {
          serviceTypeId: serviceTypeId,
          PropertyKey: key ? Like(`%${key}%`) : undefined,
          Value: value ? Like(`%${value}%`) : undefined,
        };
    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }
    const countAll = await this.configsTable.count({ where: where });
    const configs = await this.configsTable.find({
      where,
      take: limit,
      skip: skip,
    });
    return Promise.resolve({
      total: countAll,
      page,
      pageSize,
      record: configs,
    });
  }

  async getItemTypes(
    options: SessionRequest,
    page: number,
    pageSize: number,
    serviceTypeId: string,
    title: string,
    unit: number,
    fee: number,
    code: string,
    maxAvailable: number,
    maxPerRequest: number,
    minPerRequest: number
  ): Promise<PaginationReturnDto<ItemTypes>> {
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }
    const where: FindOptionsWhere<ItemTypes> = {
      serviceTypeId: serviceTypeId,
      title: title ? Like(`%${title}%`) : undefined,
      unit: unit ? Like(`%${unit}%`) : undefined,
      fee: fee ? fee : undefined,
      code: code ? Like(`%${code}%`) : undefined,
      maxAvailable: maxAvailable ? maxAvailable : undefined,
      maxPerRequest: maxPerRequest ? maxPerRequest : undefined,
      minPerRequest: minPerRequest ? minPerRequest : undefined,
    };
    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    const itemTypes = await this.itemTypesTable.find({
      where: where,
      take: limit,
      skip: skip,
    });
    for (const itemType of itemTypes) {
      const sum = await this.serviceItemsSumTable.findOne({
        where: {
          id: itemType.code,
        },
      });
      //itemType.consumption = sum.Sum;
    }
    const countAll = await this.itemTypesTable.count({ where: where });
    return Promise.resolve({
      total: countAll,
      page,
      pageSize,
      record: itemTypes,
    });
  }

  async getReports(
    options: RequestOptions,
    page: number,
    pageSize: number,
    serviceTypeId: string,
    serviceName: string,
    name: string,
    family: string,
    orgName: string
  ): Promise<PaginationReturnDto<ServiceReports>> {
    if (pageSize > 128) {
      return Promise.reject(new BadRequestException());
    }
    const where: FindOptionsWhere<ServiceReports> = isNil(
      serviceTypeId || serviceName || name || family || orgName
    )
      ? {}
      : {
          serviceTypeId: serviceTypeId,
          serviceName: serviceName ? Like(`%${serviceName}%`) : undefined,
          name: name ? Like(`%${name}%`) : undefined,
          family: family ? Like(`%${family}%`) : undefined,
          orgName: orgName ? Like(`%${orgName}%`) : undefined,
        };
    console.log(where);
    const countAll = await this.serviceReportsTable.count({ where: where });
    const reports = await this.serviceReportsTable.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    });
    return Promise.resolve({
      total: countAll,
      page,
      pageSize,
      record: reports,
    });
  }

  async getServiceCount(options: RequestOptions): Promise<{}> {
    const serviceTypes = ["vdc", "aradAi", "vgpu"];
    const serviceCounts = {};
    for (const serviceType of serviceTypes) {
      const count = await this.serviceInstancesTable.count({
        where: {
          serviceTypeId: serviceType,
        },
      });
      serviceCounts[serviceType] = count;
    }
    return Promise.resolve(serviceCounts);
  }

  async getServiceInvoices(
    options: SessionRequest,
    serviceInstanceId: string,
    page: number,
    pageSize: number,
    finalAmount: number,
    name: string,
    description: string,
    id: number,
    payed: boolean
  ): Promise<{ invoices: Invoices[]; total: number }> {
    let skip = 0;
    let limit = 10;
    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }
    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }
    const where = isNil(name || finalAmount || description || id || payed)
      ? { serviceInstanceId: serviceInstanceId }
      : {
          Name: name ? Like(`%${name}%`) : undefined,
          FinalAmount: finalAmount ? finalAmount : undefined,
          Description: description ? Like(`%${description}%`) : undefined,
          ID: id,
          serviceInstanceId: serviceInstanceId,
          Payed: payed,
        };
    const countAll = await this.invoicesTable.count({ where: where });
    const invoices = await this.invoicesTable.find({
      where: where,
      take: limit,
      skip: skip,
    });
    return Promise.resolve({ invoices, total: countAll });
  }

  async getService(
    options: SessionRequest,
    page: number,
    pageSize: number,
    filter: string
  ): Promise<{ services: ServiceInstances[]; countAll: number }> {
    let parsedFilter = {};
    let skip = 0;
    let limit = 10;

    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter).where;
    }

    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    const services: ServiceInstances[] = await this.serviceInstancesTable.find({
      relations: ["serviceItems"],
      where: {
        serviceTypeId: Not(ILike("aradAiDemo")),
        isDeleted: false,
        ...parsedFilter,
      },
      take: limit,
      skip: skip,
    });

    // let mappedServices: any[];
    // for (const service of services) {
    //     let changedService = service;

    //     const serviceItem = service['serviceItems'];
    //     console.log(serviceItem);
    //     console.log("--------------------------------")
    //     const itemType = await this.itemTypesTable.findOne({
    //         where: {
    //             id: serviceItem.ItemTypeID,
    //         },
    //     });
    //    changedService['itemTypes'] = itemType;
    //     mappedServices.push(changedService);
    // };

    parsedFilter["isDeleted"] = false;
    parsedFilter["serviceTypeId"] = Not(ILike("aradAiDemo"));
    const countAll = await this.serviceInstancesTable.count({
      where: parsedFilter,
    });
    return Promise.resolve({ services, countAll });
  }

  async getTransactions(
    options: SessionRequest,
    page: number,
    pageSize: number,
    serviceType: ServiceTypes,
    userId: number,
    value: number,
    invoiceID: number,
    ServiceID: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<{ transaction: Transactions[]; totalRecords: number }> {
    if (pageSize > 128) {
      return Promise.reject(new BadRequestException());
    }
    if (startDateTime && !endDateTime) {
      endDateTime = new Date();
    }

    let where: FindOptionsWhere<Transactions> = {};
    if (
      isNil(
        serviceType ||
          userId ||
          value ||
          invoiceID ||
          ServiceID ||
          startDateTime ||
          endDateTime
      )
    ) {
      where = {};
    } else {
      where = {
        invoiceId: invoiceID,
        userId: userId,
        serviceInstanceId: ServiceID,
        value: value,
        description: ILike(`%${serviceType}%`),
      };
    }
    if (startDateTime && endDateTime) {
      where["DateTime"] = { $between: [startDateTime, endDateTime] };
    }

    const transaction = await this.transactionsTable.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: {
        id: "DESC",
      },
      // relations: ["users"],
    });
    const withoutPagination = await this.transactionsTable.find({
      where,
    });
    const totalRecords = withoutPagination.length;
    const data = { transaction, totalRecords };
    if (!transaction) {
      return Promise.reject(new ForbiddenException());
    }
    return Promise.resolve(data);
  }

  async updateConfigs(
    options: SessionRequest,
    configId: number,
    data: UpdateConfigsDto
  ): Promise<void> {
    const config = await this.configsTable.findById(configId);
    if (isNil(config)) {
      return Promise.reject(new NotFoundException());
    }
    await this.configsTable.updateAll(
      {
        id: configId,
      },
      {
        value: data.value,
      }
    );
    return Promise.resolve();
  }

  async updateItemTypes(
    options: SessionRequest,
    serviceItemTypeId: number,
    data: UpdateItemTypesDto
  ): Promise<void> {
    const itemType = await this.itemTypesTable.findById(serviceItemTypeId);
    console.log(itemType);
    if (isNil(itemType)) {
      return Promise.reject(new NotFoundException());
    }
    await this.itemTypesTable.updateAll(
      {
        id: serviceItemTypeId,
      },

      {
        fee: data.fee,
        maxAvailable: data.maxAvailable,
        maxPerRequest: data.maxPerRequest,
        minPerRequest: data.minPerRequest || 0,
      }
    );
    await this.logger.info(
      "services",
      "updateServicesItemTypes",
      {
        itemId: serviceItemTypeId,
        data: JSON.stringify(data),
        _object: serviceItemTypeId,
      },
      { ...options.user }
    );
    return Promise.resolve();
  }

  async updateServiceResourceLimits(
    options: SessionRequest,
    serviceTypeId: string,
    data: VdcResourceLimitsDto
  ): Promise<void | Error> {
    const allowedServices = ["vdc", "vm"];
    if (!allowedServices.includes(serviceTypeId)) {
      return new ForbiddenException();
    }
    for (const itemType in data) {
      if (Object.prototype.hasOwnProperty.call(data, itemType)) {
        await this.itemTypesTable.updateAll(
          {
            code: itemType,
            serviceTypeId: serviceTypeId,
          },
          {
            maxPerRequest: data[itemType],
          }
        );
      }
    }
    await this.logger.info(
      "vdc",
      "adminUpdateServiceSettings",
      {
        username: options.user.username,
        settings: JSON.stringify(data),
        serviceTypeId,
        _object: serviceTypeId,
      },
      { ...options.user }
    );
    return;
  }
}
