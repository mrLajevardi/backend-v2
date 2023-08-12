import { CreateServiceInstancesDto } from '../../../crud/service-instances-table/dto/create-service-instances.dto';

export class GetServicesReturnDto extends CreateServiceInstancesDto {
  expired: boolean;
}
