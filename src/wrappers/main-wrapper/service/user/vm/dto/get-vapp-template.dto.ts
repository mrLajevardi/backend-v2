export interface GetVappTemplateDto {
  otherAttributes: ChildrenOtherAttributes;
  link: Link[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: null;
  tasks: null;
  name: string;
  files: null;
  status: number;
  owner: Owner;
  copyTpmOnInstantiate: boolean;
  children: Children;
  section: GetVappTemplateDtoSection[];
  defaultStorageProfile: null;
  vdcComputePolicy: null;
  computePolicy: null;
  dateCreated: Date;
  bootOptions: null;
  trustedPlatformModule: null;
  ovfDescriptorUploaded: boolean;
  goldMaster: boolean;
  vAppScopedLocalId: null;
  vCloudExtension: any[];
}

export interface Children {
  otherAttributes: ChildrenOtherAttributes;
  vm: VM[];
  vCloudExtension: any[];
}

type ChildrenOtherAttributes = Record<string, never>;

export interface VM {
  otherAttributes: ChildrenOtherAttributes;
  link: Link[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: string;
  tasks: null;
  name: string;
  files: null;
  status: number;
  owner: null;
  copyTpmOnInstantiate: null;
  children: null;
  section: VMSection[];
  defaultStorageProfile: null;
  vdcComputePolicy: null;
  computePolicy: null;
  dateCreated: Date;
  bootOptions: BootOptions;
  trustedPlatformModule: Owner;
  ovfDescriptorUploaded: null;
  goldMaster: boolean;
  vAppScopedLocalId: string;
  vCloudExtension: any[];
}

export interface BootOptions {
  otherAttributes: ChildrenOtherAttributes;
  link: any[];
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

export interface Link {
  otherAttributes: ChildrenOtherAttributes;
  href: string;
  id: null | string;
  type: null | string;
  name: null | string;
  rel?: string;
  model?: null;
  vCloudExtension: any[];
  _type?: Type;
}

export enum Type {
  LinkType = 'LinkType',
}

export interface VMSection {
  _type: string;
  info: Info;
  required: boolean;
  otherAttributes: PurpleOtherAttributes;
  primaryNetworkConnectionIndex?: number;
  networkConnection?: NetworkConnection[];
  link?: any[];
  any?: Link[];
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
  description?: Info;
  id?: number | string;
  version?: null;
  system?: System;
  item?: PurpleItem[];
  transport?: string;
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
}

export interface CPUResourceMhz {
  otherAttributes: ChildrenOtherAttributes;
  configured: number;
  reservation: number;
  limit: number;
  sharesLevel: string;
  shares: number;
  vCloudExtension: any[];
}

export interface Info {
  value: string;
  msgid: string;
  otherAttributes: ChildrenOtherAttributes;
}

export interface DiskSection {
  otherAttributes: ChildrenOtherAttributes;
  diskSettings: DiskSetting[];
  vCloudExtension: any[];
}

export interface DiskSetting {
  otherAttributes: ChildrenOtherAttributes;
  diskId: string;
  sizeMb: number;
  unitNumber: number;
  busNumber: number;
  adapterType: string;
  thinProvisioned: boolean;
  disk: null;
  storageProfile: Link;
  overrideVmDefault: boolean;
  iopsAllocation: null;
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

export interface PurpleItem {
  address: ElementName | null;
  addressOnParent: ElementName | null;
  allocationUnits: ElementName | null;
  automaticAllocation: AutomaticAllocation | null;
  automaticDellocation: null;
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
  limit: Limit | null;
  mappingBehavior: null;
  otherResourceType: null;
  parent: ElementName | null;
  poolID: null;
  reservation: Limit | null;
  resourceSubType: ElementName | null;
  resourceType: ElementName;
  virtualQuantity: Limit | null;
  virtualQuantityUnits: ElementName | null;
  weight: Limit | null;
  any: Any[];
  otherAttributes: ChildrenOtherAttributes;
  required: boolean;
  configuration: null;
  bound: null;
}

export interface ElementName {
  value: string;
  otherAttributes: ChildrenOtherAttributes;
}

export interface Any {
  _type: string;
  value: number;
  otherAttributes: ChildrenOtherAttributes;
  required: boolean;
}

export interface AutomaticAllocation {
  value: boolean;
  otherAttributes: ChildrenOtherAttributes;
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
  '{http://www.vmware.com/vcloud/v1.5}busType'?: string;
  '{http://www.vmware.com/vcloud/v1.5}busSubType'?: string;
  '{http://www.vmware.com/vcloud/v1.5}capacity'?: string;
  '{http://www.vmware.com/vcloud/v1.5}iops'?: string;
  '{http://www.vmware.com/vcloud/v1.5}storageProfileOverrideVmDefault'?: string;
}

export interface Limit {
  value: number;
  otherAttributes: ChildrenOtherAttributes;
}

export interface MediaSection {
  otherAttributes: ChildrenOtherAttributes;
  mediaSettings: MediaSetting[];
  vCloudExtension: any[];
}

export interface MediaSetting {
  otherAttributes: ChildrenOtherAttributes;
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
  otherAttributes: ChildrenOtherAttributes;
  networkConnectionIndex: number;
  ipAddress: null;
  ipType: null;
  secondaryIpAddress: null;
  secondaryIpType: null;
  externalIpAddress: null;
  isConnected: boolean;
  ipAddressAllocationMode: string;
  secondaryIpAddressAllocationMode: null;
  networkAdapterType: string;
  network: string;
  needsCustomization: boolean;
  macAddress: string;
  vCloudExtension: any[];
}

export interface PurpleOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}type'?: string;
  '{http://www.vmware.com/schema/ovf}osType'?: string;
  '{http://www.vmware.com/vcloud/v1.5}href'?: string;
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
  otherAttributes: ChildrenOtherAttributes;
}

export interface Owner {
  otherAttributes: ChildrenOtherAttributes;
  link: any[];
  href: null | string;
  type: null | string;
  tpmPresent?: boolean;
  vCloudExtension: any[];
  user?: Link;
}

export interface GetVappTemplateDtoSection {
  _type: string;
  info: Info;
  required: boolean;
  otherAttributes: FluffyOtherAttributes;
  network?: Network[];
  any: Link[];
  link?: any[];
  networkConfig?: NetworkConfig[];
  href?: string;
  type?: string;
  deploymentLeaseInSeconds?: null;
  storageLeaseInSeconds?: number;
  deploymentLeaseExpiration?: null;
  storageLeaseExpiration?: Date;
  customizeOnInstantiate?: boolean;
  goldMaster?: boolean;
  item?: FluffyItem[];
}

export interface FluffyItem {
  id: string;
  order: number;
  startDelay: number;
  waitingForGuest: boolean;
  stopDelay: number;
  startAction: string;
  stopAction: string;
  otherAttributes: ChildrenOtherAttributes;
}

export interface Network {
  description: Info;
  name: string;
  otherAttributes: ChildrenOtherAttributes;
}

export interface NetworkConfig {
  otherAttributes: ChildrenOtherAttributes;
  link: any[];
  href: null;
  type: null;
  description: string;
  configuration: Configuration;
  isDeployed: boolean;
  networkName: string;
  vCloudExtension: any[];
}

export interface Configuration {
  otherAttributes: ChildrenOtherAttributes;
  backwardCompatibilityMode: null;
  ipScopes: IPScopes;
  parentNetwork: null;
  fenceMode: string;
  retainNetInfoAcrossDeployments: null;
  features: null;
  syslogServerSettings: null;
  routerInfo: null;
  subInterface: null;
  distributedInterface: null;
  serviceInterface: null;
  guestVlanAllowed: null;
  connected: null;
  dualStackNetwork: null;
  vCloudExtension: any[];
}

export interface IPScopes {
  otherAttributes: ChildrenOtherAttributes;
  ipScope: IPScope[];
  vCloudExtension: any[];
}

export interface IPScope {
  otherAttributes: ChildrenOtherAttributes;
  isInherited: boolean;
  gateway: string;
  netmask: string;
  subnetPrefixLength: null;
  dns1: string;
  dns2: null;
  dnsSuffix: null;
  isEnabled: null;
  ipRanges: null;
  allocatedIpAddresses: null;
  subAllocations: null;
  vCloudExtension: any[];
}

export interface FluffyOtherAttributes {
  '{http://www.vmware.com/vcloud/v1.5}type'?: string;
  '{http://www.vmware.com/vcloud/v1.5}href'?: string;
}
