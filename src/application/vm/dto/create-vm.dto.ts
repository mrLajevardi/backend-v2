type Network = {
  allocationMode: string;
  ipAddress: string;
  isConnected: boolean;
  networkAdaptorType: string;
  networkName: string;
};

type Storage = { sizeMb: number };

export class CreateVmTest {
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
  storage: Storage[];
}
