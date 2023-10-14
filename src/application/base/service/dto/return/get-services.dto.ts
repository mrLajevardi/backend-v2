import { CreateServiceInstancesDto } from '../../../crud/service-instances-table/dto/create-service-instances.dto';

export class GetServicesReturnDto extends CreateServiceInstancesDto {
  id: string;
  retryCount: number;
  daysLeft: number;
}
