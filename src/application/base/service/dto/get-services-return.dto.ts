import { ServiceInstances } from "src/infrastructure/database/entities/ServiceInstances";
import { CreateServiceInstancesDto } from "../../crud/service-instances-table/dto/create-service-instances.dto";

export class GetServicesReturnDto extends CreateServiceInstancesDto {   
    expired: boolean;
  }