export type Network = {
  allocationMode: string;
  ipAddress: string;
  isConnected: boolean;
  networkAdaptorType: string;
  networkName: string;
};

export type StoragePolicy = { sizeMb: number; policyId: string };

export class CreateVm {
  computerName: string;
  name: string;
  coreNumber: number;
  cpuNumber: number;
  description: string;
  mediaHref: string;
  mediaName: string;
  networks: Network[];
  osType: string;
  powerOn: boolean;
  primaryNetworkIndex: number;
  ram: number;
  storage: StoragePolicy[];
}
