interface ApplicationPortProfile {
  orgRef: null | string;
  contextEntityId: null | string;
  networkProviderScope: null | string;
  status: string;
  id: string;
  name: string;
  description: string;
  scope: string;
  applicationPorts: ApplicationPort[];
  usableForNAT: boolean;
}

interface ApplicationPort {
  name: string;
  protocol: string;
  destinationPorts: string[];
}

export interface GetApplicationPortProfileListDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: ApplicationPortProfile[];
}
