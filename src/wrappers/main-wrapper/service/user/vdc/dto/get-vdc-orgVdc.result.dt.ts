export class GetOrgVdcResult {
  _type: string;
  link: any[];
  metadata: null;
  href: string;
  id: string;
  type: string;
  otherAttributes: OtherAttributesOrgVdc;
  name: string;
  description: string;
  computeProviderScope: null;
  networkProviderScope: null;
  isEnabled: boolean;
  cpuAllocationMhz: number;
  cpuLimitMhz: number;
  cpuUsedMhz: number;
  cpuReservedMhz: number;
  memoryAllocationMB: number;
  memoryLimitMB: number;
  memoryUsedMB: number;
  memoryReservedMB: number;
  storageLimitMB: number;
  storageUsedMB: number;
  providerVdcName: string;
  providerVdc: string;
  orgName: string;
  numberOfVApps: number;
  numberOfUnmanagedVApps: number;
  numberOfMedia: number;
  numberOfDisks: number;
  numberOfVAppTemplates: number;
  isBusy: boolean;
  status: string;
  numberOfDatastore: number;
  numberOfStorageProfiles: number;
  numberOfVMs: number;
  numberOfRunningVMs: number;
  networkPoolUniversalId: string;
  numberOfDeployedVApps: number;
  numberOfDeployedUnmanagedVApps: number;
  isThinProvisioned: boolean;
  isFastProvisioned: boolean;
  isVgpuEnabled: boolean;

  constructor(
    vdcName: string,
    cpuAllocationMhz: number,
    cpuLimitMhz: number,
    cpuUsedMhz: number,
    cpuReservedMhz: number,
    memoryAllocationMB: number,
    memoryLimitMB: number,
    memoryUsedMB: number,
    storageLimitMB: number,
    storageUsedMB: number,
    providerVdcName: string,
    providerVdc: string,
    numberOfDisks: number,
    numberOfVMs: number,
    numberOfRunningVMs: number,
  ) {
    this.name = vdcName;
    this.cpuAllocationMhz = cpuAllocationMhz;
    this.cpuLimitMhz = cpuLimitMhz;
    this.cpuUsedMhz = cpuUsedMhz;
    this.cpuReservedMhz = cpuReservedMhz;
    this.memoryAllocationMB = memoryAllocationMB;
    this.memoryLimitMB = memoryLimitMB;
    this.memoryUsedMB = memoryUsedMB;
    this.storageLimitMB = storageLimitMB;
    this.storageUsedMB = storageUsedMB;
    this.providerVdcName = providerVdcName;
    this.providerVdc = providerVdc;
    this.numberOfDisks = numberOfDisks;
    this.numberOfVMs = numberOfVMs;
    this.numberOfRunningVMs = numberOfRunningVMs;
  }
}

export class OtherAttributesOrgVdc {
  cpuOverheadMhz: string;
  pvdcHardwareVersion: string;
  taskStatusName: string;
  task: string;
  allocationModel: string;
  networkPool: string;
  storageOverheadMB: string;
  memoryOverheadMB: string;
  taskStatus: string;
  taskDetails: string;
}
