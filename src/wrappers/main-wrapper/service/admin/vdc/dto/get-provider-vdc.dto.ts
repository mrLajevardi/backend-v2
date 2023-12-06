import { OtherAttributes } from './get-provider-vdcs-metadata.dto';

export interface GetProviderVdcDto {
  otherAttributes: OtherAttributes;
  link: Link[];
  href: string;
  type: string;
  id: string;
  operationKey: null;
  description: string;
  tasks: null;
  name: string;
  computeCapacity: ComputeCapacity;
  availableNetworks: AvailableNetworks;
  storageProfiles: StorageProfiles;
  capabilities: Capabilities;
  vdcs: null;
  isEnabled: boolean;
  networkPoolReferences: NetworkPoolReferences;
  status: number;
  vCloudExtension: any[];
}

export interface AvailableNetworks {
  otherAttributes: OtherAttributes;
  network: Link[];
  vCloudExtension: any[];
}

export interface Link {
  otherAttributes: OtherAttributes;
  href: string;
  id: null | string;
  type: null | string;
  name: null | string;
  vCloudExtension: any[];
  rel?: string;
  model?: null;
}

export interface Capabilities {
  otherAttributes: OtherAttributes;
  supportedHardwareVersions: SupportedHardwareVersions;
  vCloudExtension: any[];
}

export interface SupportedHardwareVersions {
  otherAttributes: OtherAttributes;
  supportedHardwareVersion: SupportedHardwareVersion[];
  vCloudExtension: any[];
}

export interface SupportedHardwareVersion {
  _type: Type;
  content: string;
  name: string;
  href: string;
  type: TypeEnum;
  default: boolean | null;
}

export enum Type {
  SupportedHardwareVersionType = 'SupportedHardwareVersionType',
}

export enum TypeEnum {
  ApplicationVndVmwareVcloudVirtualHardwareVersionXML = 'application/vnd.vmware.vcloud.virtualHardwareVersion+xml',
}

export interface ComputeCapacity {
  otherAttributes: OtherAttributes;
  cpu: CPU;
  memory: CPU;
  isElastic: null;
  isHA: null;
  vCloudExtension: any[];
}

export interface CPU {
  otherAttributes: OtherAttributes;
  units: string;
  allocation: number;
  reserved: number;
  total: number;
  used: number;
  overhead: number;
  vCloudExtension: any[];
}

export interface NetworkPoolReferences {
  otherAttributes: OtherAttributes;
  networkPoolReference: Link[];
  vCloudExtension: any[];
}

export interface StorageProfiles {
  otherAttributes: OtherAttributes;
  providerVdcStorageProfile: Link[];
  vCloudExtension: any[];
}
