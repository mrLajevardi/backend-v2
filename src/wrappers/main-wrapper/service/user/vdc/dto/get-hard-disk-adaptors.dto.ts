export interface GetHardDiskAdaptors {
  otherAttributes: OtherAttributes;
  link: any[];
  href: string;
  type: string;
  id: null;
  operationKey: null;
  name: string;
  maxCoresPerSocket: number;
  supportedOperatingSystems: SupportedOperatingSystems;
  maxMemorySizeMb: number;
  maxCPUs: number;
  maxNICs: number;
  supportsNestedHV: boolean;
  supportsHotPlugPCI: boolean;
  supportsHotAdd: boolean;
  supportedMemorySizeGb: number[];
  supportedCoresPerSocket: number[];
  hardDiskAdapter: HardDiskAdapter[];
  vCloudExtension: any[];
}

export interface HardDiskAdapter {
  otherAttributes: OtherAttributes;
  busNumberRanges: NumberRanges;
  unitNumberRanges: NumberRanges;
  reservedBusUnitNumber: ReservedBusUnitNumber | null;
  id: ID;
  legacyId: number;
  name: string;
  maximumDiskSizeGb: number;
  vCloudExtension: any[];
}

export interface NumberRanges {
  otherAttributes: OtherAttributes;
  range: Range[];
  vCloudExtension: any[];
}

export type OtherAttributes = Record<string, never>;

export interface Range {
  otherAttributes: OtherAttributes;
  begin: number;
  end: number;
  vCloudExtension: any[];
}

export enum ID {
  ParaVirtualSCSIController = 'ParaVirtualSCSIController',
  VirtualAHCIController = 'VirtualAHCIController',
  VirtualBusLogicController = 'VirtualBusLogicController',
  VirtualIDEController = 'VirtualIDEController',
  VirtualLSILogicController = 'VirtualLsiLogicController',
  VirtualLSILogicSASController = 'VirtualLsiLogicSASController',
  VirtualNVMEController = 'VirtualNVMEController',
}

export interface ReservedBusUnitNumber {
  busNumber: number;
  unitNumber: number;
}

export interface SupportedOperatingSystems {
  otherAttributes: OtherAttributes;
  link: any[];
  href: null;
  type: null;
  operatingSystemFamilyInfo: OperatingSystemFamilyInfo[];
  vCloudExtension: any[];
}

export interface OperatingSystemFamilyInfo {
  otherAttributes: OtherAttributes;
  name: string;
  operatingSystemFamilyId: number;
  operatingSystem: OperatingSystem[];
  vCloudExtension: any[];
}

export interface OperatingSystem {
  otherAttributes: OtherAttributes;
  operatingSystemId: null;
  defaultHardDiskAdapterType: DefaultHardDiskAdapterType;
  supportedHardDiskAdapter: SupportedHardDiskAdapter[];
  minimumHardDiskSizeGigabytes: number;
  minimumMemoryMegabytes: number;
  name: string;
  internalName: string;
  supported: boolean;
  supportLevel: SupportLevel;
  maximumCpuCount: number;
  maximumCoresPerSocket: number;
  maximumSocketCount: number;
  minimumHardwareVersion: number;
  personalizationEnabled: boolean;
  personalizationAuto: boolean;
  sysprepPackagingSupported: boolean;
  supportsMemHotAdd: boolean;
  cimOsId: number;
  cimVersion: number;
  supportedForCreate: boolean;
  recommendedNIC: RecommendedNIC;
  supportedNICType: RecommendedNIC[];
  recommendedFirmware: EdFirmware;
  supportedFirmware: EdFirmware[];
  supportsTPM: boolean;
  x64: boolean;
  vCloudExtension: any[];
}

export interface DefaultHardDiskAdapterType {
  value: number;
  ref: ID;
}

export enum EdFirmware {
  BIOS = 'bios',
  EFI = 'efi',
}

export interface RecommendedNIC {
  _type: Type;
  name: NetworkAdapterTypes;
  id: null;
}

export enum Type {
  NICType = 'NICType',
}

export enum NetworkAdapterTypes {
  E1000 = 'E1000',
  E1000E = 'E1000E',
  Flexible = 'FLEXIBLE',
  Sriovethernetcard = 'SRIOVETHERNETCARD',
  Vlance = 'VLANCE',
  Vmxnet = 'VMXNET',
  Vmxnet2 = 'VMXNET2',
  Vmxnet3 = 'VMXNET3',
  Vmxnet3Vrdma = 'VMXNET3VRDMA',
}

export enum SupportLevel {
  Deprecated = 'deprecated',
  Legacy = 'legacy',
  Supported = 'supported',
  Terminated = 'terminated',
  Unsupported = 'unsupported',
}

export interface SupportedHardDiskAdapter {
  ref: ID;
}
