import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { In } from 'typeorm';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskManagerService } from '../../tasks/service/task-manager.service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly tasksTableService: TasksTableService,
  ) {}

  // Create Service Items
  async createServiceItems(serviceInstanceID, items, data) {
    for (const item of Object.keys(items)) {
      let dto: CreateServiceItemsDto;
      const itemTitle = items[item].Code;
      dto.quantity = data[itemTitle];
      dto.itemTypeId = items[item].ID;
      dto.serviceInstanceId = serviceInstanceID;
      dto.itemTypeCode = items[item].Code;
      await this.serviceItemsTable.create(dto);
    }
  }

  async getAllServiceProperties(serviceId) {
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId: serviceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    return Promise.resolve(props);
  }

  async getServices(options: any) {
    const {
      user: { userId },
    } = options;
    const services = await this.serviceInstancesTableService.find({
      where: {
        userId,
        isDeleted: false,
        serviceTypeId: In(['vdc', 'vgpu', 'aradAi']),
      },
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
