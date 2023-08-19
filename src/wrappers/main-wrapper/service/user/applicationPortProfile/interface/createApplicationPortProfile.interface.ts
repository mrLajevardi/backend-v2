import { ApplicationPorts } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/applicationPortProfile/dto/create-application-port-profiles.dto';

export interface CreateApplicationPortProfileInterface {
  description: string;
  name: string;
  vdcId: string;
  orgId: string;
  applicationPorts: ApplicationPorts[];
}

export interface CreateApplicationPortProfileDto {
  __vcloudTask: string;
}
