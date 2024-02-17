import { NetworkAdapterTypes } from '../../vdc/dto/get-hard-disk-adaptors.dto';
import { AllocationModes } from './create-vm.dto';

export interface GetVappTemplateDto {
  otherAttributes: BootOptionsOtherAttributes;
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
  copyTpmOnInstantiate: boolean;
  children: null;
  section: Section[];
  defaultStorageProfile: null;
  vdcComputePolicy: null;
  computePolicy: null;
  dateCreated: Date;
  bootOptions: BootOptions;
  trustedPlatformModule: TrustedPlatformModule;
  ovfDescriptorUploaded: null;
  goldMaster: boolean;
  vAppScopedLocalId: string;
  vCloudExtension: any[];
}

export interface BootOptions {
  otherAttributes: BootOptionsOtherAttributes;
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

export type BootOptionsOtherAttributes = Record<string, never>;

export interface Link {
  otherAttributes: BootOptionsOtherAttributes;
  href: string;
  id: null | string;
  type: string;
  name: null | string;
  rel?: Rel;
  model?: null;
  vCloudExtension: any[];
  _type?: Type;
}

export enum Type {
  LinkType = 'LinkType',
}

export enum Rel {
  Down = 'down',
  StorageProfile = 'storageProfile',
  Up = 'up',
}

export interface Section {
  _type: string;
  info: Description;
  required: boolean;
  otherAttributes: SectionOtherAttributes;
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
  description?: Description;
  id?: number | string;
  version?: null;
  system?: System;
  item?: Item[];
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
  otherAttributes: BootOptionsOtherAttributes;
  configured: number;
  reservation: null;
  limit: null;
  sharesLevel: null;
  shares: null;
  vCloudExtension: any[];
}

export interface Description {
  value: string;
  msgid: string;
  otherAttributes: BootOptionsOtherAttributes;
}

export interface DiskSection {
  otherAttributes: BootOptionsOtherAttributes;
  diskSettings: DiskSetting[];
  vCloudExtension: any[];
}

export interface DiskSetting {
  otherAttributes: BootOptionsOtherAttributes;
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
  any: Any[];
  otherAttributes: BootOptionsOtherAttributes;
  required: boolean;
  configuration: null;
  bound: null;
}

export interface ElementName {
  value: string;
  otherAttributes: BootOptionsOtherAttributes;
}

export interface Any {
  _type: string;
  value: number;
  otherAttributes: BootOptionsOtherAttributes;
  required: boolean;
}

export interface AutomaticAllocation {
  value: boolean;
  otherAttributes: BootOptionsOtherAttributes;
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

export interface Reservation {
  value: number;
  otherAttributes: BootOptionsOtherAttributes;
}

export interface MediaSection {
  otherAttributes: BootOptionsOtherAttributes;
  mediaSettings: MediaSetting[];
  vCloudExtension: any[];
}

export interface MediaSetting {
  otherAttributes: BootOptionsOtherAttributes;
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
  otherAttributes: BootOptionsOtherAttributes;
  networkConnectionIndex: number;
  ipAddress: null;
  ipType: null;
  secondaryIpAddress: null;
  secondaryIpType: null;
  externalIpAddress: null;
  isConnected: boolean;
  ipAddressAllocationMode: AllocationModes;
  secondaryIpAddressAllocationMode: string;
  networkAdapterType: NetworkAdapterTypes;
  network: string;
  needsCustomization: boolean;
  macAddress: string;
  vCloudExtension: any[];
}

export interface SectionOtherAttributes {
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
  otherAttributes: BootOptionsOtherAttributes;
}

export interface TrustedPlatformModule {
  otherAttributes: BootOptionsOtherAttributes;
  link: any[];
  href: string;
  type: null;
  tpmPresent: boolean;
  vCloudExtension: any[];
}
