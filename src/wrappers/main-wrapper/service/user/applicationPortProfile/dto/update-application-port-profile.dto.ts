import { ApplicationPortsProtocols } from '../enum/application-ports-protocols.enum';

export class UpdateApplicationPortProfileConfig {
  name: string;
  description: string;
  applicationPorts: ApplicationPorts[];
  orgId: string;
  vdcId: string;
}
export class ApplicationPorts {
  protocol: ApplicationPortsProtocols;
  destinationPorts: number[];
}
