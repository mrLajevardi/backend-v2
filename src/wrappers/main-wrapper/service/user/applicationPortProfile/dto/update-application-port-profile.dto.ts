export class UpdateApplicationPortProfileConfig {
  name: string;
  description: string;
  applicationPorts: ApplicationPorts[];
  orgId: string;
  vdcId: string;
}
export class ApplicationPorts {
  protocol: string;
  destinationPorts: number[];
}
