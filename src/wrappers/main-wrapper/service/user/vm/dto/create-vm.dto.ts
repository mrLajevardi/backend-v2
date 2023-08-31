import { NetworkAdapterTypes } from '../../vdc/dto/get-hard-disk-adaptors.dto';

export class CreateVmDto {
  computerName: string;
  coreNumber: number;
  cpuNumber: number;
  mediaName: string;
  mediaHref: string;
  name: string;
  primaryNetworkIndex: number;
  osType: string;
  ram: number;
  storage: Storage[];
  networks: Networks[];
  powerOn: boolean;
  description: string;
}

class Networks {
  networkName: string;
  ipAddress: string;
  isConnected: boolean;
  allocationMode: AllocationModes;
  networkAdaptorType: NetworkAdapterTypes;
}

export enum AllocationModes {
  NONE = 'NONE',
  DHCP = 'DHCP',
  POOL = 'POOL',
  MANUAL = 'MANUAL',
}

class Storage {
  sizeMb: number;
}
