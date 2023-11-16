export interface HardDiskAdapter {
  id: string;
  legacyId: number;
  name: string;
}

export interface OsFamily {
  name: string;
  operatingSystem: OperatingSystem[];
  operatingSystemFamilyId: number;
}

export interface OperatingSystem {
  supportedHardDiskAdapter: SupportedHardDiskAdapter[];
  name: string;
  internalName: string;
  supportedNICType: SupportedNICType[];
  defaultHardDiskAdapterType: DefaultHardDiskAdapterType;
}

interface DefaultHardDiskAdapterType {
  value: number;
  ref: string;
}

interface SupportedNICType {
  _type: string;
  name: string;
  id?: any;
}

interface SupportedHardDiskAdapter {
  ref: string;
}

export class HardwareInfo {
  maxCoresPerSocket: number;
  maxMemorySizeMb: number;
  maxCPUs: number;
  supportedMemorySizeGb?: number[];
  osFamily: OsFamily[];
  hardDiskAdapter: HardDiskAdapter[];
}
