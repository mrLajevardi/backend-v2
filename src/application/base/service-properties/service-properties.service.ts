import { Injectable } from '@nestjs/common';
import { ServicePropertiesTableService } from '../crud/service-properties-table/service-properties-table.service';

@Injectable()
export class ServicePropertiesService {
  constructor(
    private readonly servicePropertiesTable: ServicePropertiesTableService,
  ) {}

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
}
