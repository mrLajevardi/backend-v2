import { Injectable } from '@nestjs/common';
import { CreateServiceItemsDto } from '../../crud/service-items-table/dto/create-service-items.dto';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
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
        ServiceInstanceID: serviceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    return Promise.resolve(props);
  }
}
