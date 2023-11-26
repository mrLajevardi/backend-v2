import { NetworkStatusEnum } from '../../network/enum/network-status.enum';

interface ApplicationPort {
  name: string;
  protocol: string;
  destinationPorts: number[];
}

export interface GetApplicationPortProfileDto {
  orgRef: null;
  contextEntityId: null;
  networkProviderScope: null;
  status: NetworkStatusEnum;
  id: string;
  name: string;
  description: string;
  scope: string;
  applicationPorts: ApplicationPort[];
  usableForNAT: boolean;
}
