export class VmSupportedHardDiskAdaptors {
  id: string;
  busNumberRanges: BusNumberRange[];
  legacyId: number;
  name: string;
  reservedBusUnitNumber?: any;
  unitNumberRanges: BusNumberRange[];
}
interface BusNumberRange {
  begin: number;
  end: number;
}

export class VmComputeSection {
  numCpus: number;
  numCoresPerSocket: number;
  memory: number;
  nestedHypervisorEnabled: boolean;
  memoryHotAddEnabled: boolean;
  cpuHotAddEnabled: boolean;
  numberOfSockets: number;
  maximumCoresPerSocket: number;
  maximumCpuCount: number;
  maximumSocketCount: number;
  minimumMemoryMegabytes: number;
}

export class VmGuestCustomization {
  enabled: boolean;
  changeSid: boolean;
  joinDomainEnabled: boolean;
  useOrgSettings: boolean;
  domainName?: any;
  domainUserName?: any;
  domainUserPassword?: any;
  machineObjectOU?: any;
  adminPasswordEnabled: boolean;
  adminPasswordAuto: boolean;
  adminPassword?: any;
  adminAutoLogonEnabled: boolean;
  adminAutoLogonCount: number;
  resetPasswordRequired: boolean;
  customizationScript?: any;
  computerName: string;
  osType: string;
}

export class VmQuery {
  otherAttributes: OtherAttributes;
  link: Link[];
  href: string;
  type: string;
  name?: any;
  page?: any;
  pageSize?: any;
  total?: any;
  vCloudExtension: any[];
}

interface Link {
  otherAttributes: OtherAttributes;
  href: string;
  id?: any;
  type: string;
  name: string;
  rel: string;
  model?: any;
  vCloudExtension: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OtherAttributes {}
