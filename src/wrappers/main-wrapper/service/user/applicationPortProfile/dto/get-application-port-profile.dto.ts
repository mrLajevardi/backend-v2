interface ApplicationPort {
  name: string;
  protocol: string;
  destinationPorts: string[];
}

export interface GetApplicationPortProfileDto {
  orgRef: null;
  contextEntityId: null;
  networkProviderScope: null;
  status: string;
  id: string;
  name: string;
  description: string;
  scope: string;
  applicationPorts: ApplicationPort[];
  usableForNAT: boolean;
}
