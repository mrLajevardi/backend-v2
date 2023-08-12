import { ServiceInstances } from "src/infrastructure/database/entities/ServiceInstances";

export class GetServicesReturnDto extends ServiceInstances { 
    expired: boolean; 
}