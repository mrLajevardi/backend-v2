export interface GetVappDto {
  otherAttributes: StorageProfileOtherAttributes;
  link: StorageProfile[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: string;
  tasks: null;
  name: string;
  files: null;
  status: number;
  section: Section[];
  dateCreated: Date;
  deployed: boolean;
  environment: null;
  vmCapabilities: VMCapabilities;
  storageProfile: StorageProfile;
  vdcComputePolicy: StorageProfile;
  computePolicy: ComputePolicy;
  computePolicyCompliance: any[];
  isComputePolicyCompliant: boolean;
  bootOptions: BootOptions;
  media: null;
  replicationTrackingSettings: null;
  trustedPlatformModule: TrustedPlatformModule;
  isVAppConfigRemoved: boolean;
  encrypted: null;
  needsCustomization: boolean;
  nestedHypervisorEnabled: boolean;
  vAppScopedLocalId: string;
  vAppParent: null;
  vCloudExtension: any[];
}

export interface BootOptions {
  otherAttributes: StorageProfileOtherAttributes;
  link: StorageProfile[];
  href: string;
  type: string;
  bootDelay: number;
  enterBIOSSetup: boolean;
  bootRetryEnabled: boolean;
  bootRetryDelay: number;
  efiSecureBootEnabled: boolean;
  networkBootProtocol: string;
  vCloudExtension: any[];
}

export interface StorageProfile {
  otherAttributes: StorageProfileOtherAttributes;
  href?: string;
  id?: null | string;
  type?: null | string;
  name?: null | string;
  rel?: string;
  model?: null | string;
  vCloudExtension?: any[];
  _type?: Type;
  value?: number;
  required?: boolean;
}

export enum Type {
  CoresPerSocketType = 'CoresPerSocketType',
  LinkType = 'LinkType',
}

type StorageProfileOtherAttributes = Record<string, never>;

export interface ComputePolicy {
  otherAttributes: StorageProfileOtherAttributes;
  link: any[];
  href: null;
  type: null;
  vmPlacementPolicy: null;
  vmPlacementPolicyFinal: null;
  vmSizingPolicy: StorageProfile;
  vmSizingPolicyFinal: boolean;
  vCloudExtension: any[];
}

export interface Section {
  _type: string;
  info: Description;
  required: boolean;
  otherAttributes: SectionOtherAttributes;
  osType?: string;
  firmware?: string;
  numCpus?: number;
  numCoresPerSocket?: number;
  cpuResourceMhz?: CPUResourceMhz;
  memoryResourceMb?: CPUResourceMhz;
  mediaSection?: MediaSection;
  diskSection?: DiskSection;
  hardwareVersion?: HardwareVersion;
  vmToolsVersion?: string;
  toolsGuestOsId?: null;
  virtualCpuType?: string;
  timeSyncWithHost?: boolean;
  modified?: null;
  system?: System;
  item?: Item[];
  any?: StorageProfile[];
  id?: number | string;
  transport?: string;
  description?: Description;
  version?: null;
  primaryNetworkConnectionIndex?: number;
  networkConnection?: NetworkConnection[];
  link?: StorageProfile[];
  href?: string;
  type?: string;
  enabled?: boolean;
  changeSid?: boolean;
  virtualMachineId?: string;
  joinDomainEnabled?: boolean;
  useOrgSettings?: boolean;
  domainName?: null;
  domainUserName?: null;
  domainUserPassword?: null;
  machineObjectOU?: null;
  adminPasswordEnabled?: boolean;
  adminPasswordAuto?: boolean;
  adminPassword?: null;
  adminAutoLogonEnabled?: boolean;
  adminAutoLogonCount?: number;
  resetPasswordRequired?: boolean;
  customizationScript?: null;
  computerName?: string;
  vmWareTools?: VMWareTools;
  snapshot?: null;
}

export interface CPUResourceMhz {
  otherAttributes: StorageProfileOtherAttributes;
  configured?: number;
  reservation: number | null;
  limit: number | null;
  sharesLevel: null | string;
  shares: number | null;
  vCloudExtension: any[];
}

export interface Description {
  value: string;
  msgid: string;
  otherAttributes: StorageProfileOtherAttributes;
}

export interface DiskSection {
  otherAttributes: StorageProfileOtherAttributes;
  diskSettings: DiskSetting[];
  vCloudExtension: any[];
}

export interface DiskSetting {
  otherAttributes: StorageProfileOtherAttributes;
  diskId: string;
  sizeMb: number;
  unitNumber: number;
  busNumber: number;
  adapterType: string;
  thinProvisioned: boolean;
  disk: StorageProfile | null;
  storageProfile: StorageProfile;
  overrideVmDefault: boolean;
  iopsAllocation: CPUResourceMhz;
  virtualQuantityUnit: string;
  virtualQuantity: null;
  resizable: boolean;
  encrypted: null;
  shareable: boolean;
  sharingType: string;
  vCloudExtension: any[];
}

export interface HardwareVersion {
  _type: string;
  content: string;
  href: string;
  type: string;
}

export interface Item {
  address: ElementName | null;
  addressOnParent: ElementName | null;
  allocationUnits: ElementName | null;
  automaticAllocation: AutomaticAllocation | null;
  automaticDeallocation: null;
  caption: null;
  changeableType: null;
  configurationName: null;
  connection: Connection[];
  consumerVisibility: null;
  description: ElementName;
  elementName: ElementName;
  generation: null;
  hostResource: HostResource[];
  instanceID: ElementName;
  limit: null;
  mappingBehavior: null;
  otherResourceType: null;
  parent: ElementName | null;
  poolID: null;
  reservation: Reservation | null;
  resourceSubType: ElementName | null;
  resourceType: ElementName;
  virtualQuantity: Reservation | null;
  virtualQuantityUnits: ElementName | null;
  weight: Reservation | null;
  any: StorageProfile[];
  otherAttributes: ItemOtherAttributes;
  required: boolean;
  configuration: null;
  bound: null;
}

export interface ElementName {
  value: string;
  otherAttributes: StorageProfileOtherAttributes;
}

export interface AutomaticAllocation {
  value: boolean;
  otherAttributes: StorageProfileOtherAttributes;
}

export interface Connection {
  value: string;
  otherAttributes: ConnectionOtherAttributes;
}

export interface ConnectionOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}ipAddressingMode': string;
  '{http://www.vmware.com/vcloud/v1.5}primaryNetworkConnection': string;
}

export interface HostResource {
  value: string;
  otherAttributes: HostResourceOtherAttributes;
}

export interface HostResourceOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}storageProfileHref'?: string;
  '{http://www.vmware.com/vcloud/v1.5}disk'?: string;
  '{http://www.vmware.com/vcloud/v1.5}busType'?: string;
  '{http://www.vmware.com/vcloud/v1.5}busSubType'?: string;
  '{http://www.vmware.com/vcloud/v1.5}capacity'?: string;
  '{http://www.vmware.com/vcloud/v1.5}iops'?: string;
  '{http://www.vmware.com/vcloud/v1.5}storageProfileOverrideVmDefault'?: string;
}

export interface ItemOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}type'?: string;
  '{http://www.vmware.com/vcloud/v1.5}href'?: string;
}

export interface Reservation {
  value: number;
  otherAttributes: StorageProfileOtherAttributes;
}

export interface MediaSection {
  otherAttributes: StorageProfileOtherAttributes;
  mediaSettings: MediaSetting[];
  vCloudExtension: any[];
}

export interface MediaSetting {
  otherAttributes: StorageProfileOtherAttributes;
  deviceId: string;
  mediaImage: null;
  mediaType: string;
  mediaState: string;
  unitNumber: number;
  busNumber: number;
  adapterType: null | string;
  vCloudExtension: any[];
}

export interface NetworkConnection {
  otherAttributes: StorageProfileOtherAttributes;
  networkConnectionIndex: number;
  ipAddress: null;
  ipType: null;
  secondaryIpAddress: null;
  secondaryIpType: null;
  externalIpAddress: null;
  isConnected: boolean;
  ipAddressAllocationMode: string;
  secondaryIpAddressAllocationMode: string;
  networkAdapterType: string;
  network: string;
  needsCustomization: boolean;
  macAddress: string;
  vCloudExtension: any[];
}

export interface SectionOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}type'?: string;
  '{http://www.vmware.com/vcloud/v1.5}href'?: string;
  '{http://www.vmware.com/schema/ovf}osType'?: string;
}

export interface System {
  automaticRecoveryAction: null;
  automaticShutdownAction: null;
  automaticStartupAction: null;
  automaticStartupActionDelay: null;
  automaticStartupActionSequenceNumber: null;
  caption: null;
  changeableType: null;
  configurationDataRoot: null;
  configurationFile: null;
  configurationID: null;
  configurationName: null;
  creationTime: null;
  description: null;
  elementName: ElementName;
  generation: null;
  instanceID: ElementName;
  logDataRoot: null;
  notes: any[];
  recoveryFile: null;
  snapshotDataRoot: null;
  suspendDataRoot: null;
  swapFileDataRoot: null;
  virtualSystemIdentifier: ElementName;
  virtualSystemType: ElementName;
  any: any[];
  otherAttributes: StorageProfileOtherAttributes;
}

export interface VMWareTools {
  version: string;
}

export interface TrustedPlatformModule {
  otherAttributes: StorageProfileOtherAttributes;
  link: any[];
  href: string;
  type: null;
  tpmPresent: boolean;
  vCloudExtension: any[];
}

export interface VMCapabilities {
  otherAttributes: StorageProfileOtherAttributes;
  link: StorageProfile[];
  href: string;
  type: string;
  memoryHotAddEnabled: boolean;
  cpuHotAddEnabled: boolean;
  vCloudExtension: any[];
}
