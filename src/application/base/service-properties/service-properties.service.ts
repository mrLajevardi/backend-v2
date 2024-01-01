import { Injectable } from '@nestjs/common';
import { ServicePropertiesTableService } from '../crud/service-properties-table/service-properties-table.service';

@Injectable()
export class ServicePropertiesService {
  constructor(
    private readonly servicePropertiesTable: ServicePropertiesTableService,
  ) {}

  async getAllServiceProperties<T = object>(serviceId: string): Promise<T> {
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId: serviceId,
      },
    });
    const props: T = {} as T;
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    return Promise.resolve(props);
  }
}
