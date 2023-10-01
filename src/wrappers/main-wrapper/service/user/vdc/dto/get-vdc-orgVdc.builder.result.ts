import {
  GetOrgVdcResult,
  OtherAttributesOrgVdc,
} from './get-vdc-orgVdc.result.dt';

export class GetVdcOrgVdcBuilderResult {
  private _type: string;
  private link: any[];
  private metadata: string;
  private href: string;
  private id: string;
  private type: string;
  private otherAttributes: OtherAttributesOrgVdc;
  private name: string;
  private description: string;
  private computeProviderScope: null;
  private networkProviderScope: null;
  private isEnabled: boolean;
  private cpuAllocationMhz: number;
  private cpuLimitMhz: number;
  private cpuUsedMhz: number;
  private cpuReservedMhz: number;
  private memoryAllocationMB: number;
  private memoryLimitMB: number;
  private memoryUsedMB: number;
  private memoryReservedMB: number;
  private storageLimitMB: number;
  private storageUsedMB: number;
  private providerVdcName: string;
  private providerVdc: string;
  private orgName: string;
  private numberOfVApps: number;
  private numberOfUnmanagedVApps: number;
  private numberOfMedia: number;
  private numberOfDisks: number;
  private numberOfVAppTemplates: number;
  private isBusy: boolean;
  private status: string;
  private numberOfDatastore: number;
  private numberOfStorageProfiles: number;
  private numberOfVMs: number;
  private numberOfRunningVMs: number;
  private networkPoolUniversalId: string;
  private numberOfDeployedVApps: number;
  private numberOfDeployedUnmanagedVApps: number;
  private isThinProvisioned: boolean;
  private isFastProvisioned: boolean;
  private isVgpuEnabled: boolean;

  private constructor() {}

  static GetBuilder(): GetVdcOrgVdcBuilderResult {
    return new GetVdcOrgVdcBuilderResult();
  }
  public WithVdcName(vdcName: string): GetVdcOrgVdcBuilderResult {
    this.name = vdcName;
    return this;
  }
  public WithCpuAllocationMhz(
    cpuAllocationMhz: number,
  ): GetVdcOrgVdcBuilderResult {
    this.cpuAllocationMhz = cpuAllocationMhz;
    return this;
  }

  public WithCpuLimitMhz(cpuLimitMhz: number): GetVdcOrgVdcBuilderResult {
    this.cpuLimitMhz = cpuLimitMhz;
    return this;
  }

  public WithCpuUsedMhz(cpuUsedMhz: number): GetVdcOrgVdcBuilderResult {
    this.cpuUsedMhz = cpuUsedMhz;
    return this;
  }

  public WithCpuReservedMhz(cpuReservedMhz: number): GetVdcOrgVdcBuilderResult {
    this.cpuReservedMhz = cpuReservedMhz;
    return this;
  }

  public WithMemoryAllocationMB(
    memoryAllocationMB: number,
  ): GetVdcOrgVdcBuilderResult {
    this.memoryAllocationMB = memoryAllocationMB;
    return this;
  }

  public WithMemoryLimitMB(memoryLimitMB: number): GetVdcOrgVdcBuilderResult {
    this.memoryLimitMB = memoryLimitMB;
    return this;
  }

  public WithMemoryUsedMB(memoryUsedMB: number): GetVdcOrgVdcBuilderResult {
    this.memoryUsedMB = memoryUsedMB;
    return this;
  }

  public WithMemoryReservedMB(
    memoryReservedMB: number,
  ): GetVdcOrgVdcBuilderResult {
    this.memoryReservedMB = memoryReservedMB;
    return this;
  }

  public WithStorageLimitMB(storageLimitMB: number): GetVdcOrgVdcBuilderResult {
    this.storageLimitMB = storageLimitMB;
    return this;
  }

  public WithStorageUsedMB(storageUsedMB: number): GetVdcOrgVdcBuilderResult {
    this.storageUsedMB = storageUsedMB;
    return this;
  }

  public WithProviderVdcName(
    providerVdcName: string,
  ): GetVdcOrgVdcBuilderResult {
    this.providerVdcName = providerVdcName;
    return this;
  }

  public WithProviderVdc(providerVdc: string): GetVdcOrgVdcBuilderResult {
    this.providerVdc = providerVdc;
    return this;
  }

  public WithNumberOfDisks(numberOfDisks: number): GetVdcOrgVdcBuilderResult {
    this.numberOfDisks = numberOfDisks;
    return this;
  }

  public WithNumberOfVMs(numberOfVMs: number): GetVdcOrgVdcBuilderResult {
    this.numberOfVMs = numberOfVMs;
    return this;
  }

  public WithNumberOfRunningVMs(
    numberOfRunningVMs: number,
  ): GetVdcOrgVdcBuilderResult {
    this.numberOfRunningVMs = numberOfRunningVMs;
    return this;
  }

  public Build(): GetOrgVdcResult {
    return new GetOrgVdcResult(
      this.name,
      this.cpuAllocationMhz,
      this.cpuLimitMhz,
      this.cpuUsedMhz,
      this.cpuReservedMhz,
      this.memoryAllocationMB,
      this.memoryLimitMB,
      this.memoryUsedMB,
      this.storageLimitMB,
      this.storageUsedMB,
      this.providerVdcName,
      this.providerVdc,
      this.numberOfDisks,
      this.numberOfVMs,
      this.numberOfRunningVMs,
    );
  }
}

export class OtherAttributeVdcOrgVdcBuilder {
  private cpuOverheadMhz: string;
  private pvdcHardwareVersion: string;
  private taskStatusName: string;
  private task: string;
  private allocationModel: string;
  private networkPool: string;
  private storageOverheadMB: string;
  private memoryOverheadMB: string;
  private taskStatus: string;
  private taskDetails: string;

  private constructor() {}

  static GetBuilder(): OtherAttributeVdcOrgVdcBuilder {
    return new OtherAttributeVdcOrgVdcBuilder();
  }
}
