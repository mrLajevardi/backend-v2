export interface GetVMQueryDto {
  link: Link[];
  href: string;
  type: string;
  name: string;
  page: number;
  pageSize: number;
  total: number;
  record: Record[];
  vCloudExtension: any[];
}

export interface Link {
  href: string;
  id: null;
  type: null | string;
  name: null | string;
  rel: string;
  model: null | string;
  vCloudExtension: any[];
}

export interface Record {
  _type: string;
  link: Link[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: RecordOtherAttributes;
  name: string;
  containerName: string;
  container: string;
  ownerName: string;
  owner: string;
  vdcName: string;
  vdc: string;
  description: string;
  vappScopedLocalId: string;
  isVAppTemplate: boolean;
  isDeleted: boolean;
  guestOs: string;
  detectedGuestOs: string;
  numberOfCpus: number;
  memoryMB: number;
  status: string;
  networkName: string;
  network: string;
  ipAddress: null;
  isBusy: boolean;
  isDeployed: boolean;
  isPublished: boolean;
  catalogName: null;
  hardwareVersion: number;
  vmToolsStatus: string;
  isInMaintenanceMode: boolean;
  isAutoNature: boolean;
  storageProfileName: string;
  snapshot: boolean;
  snapshotCreated: null;
  gcStatus: string;
  autoUndeployDate: Date;
  autoDeleteDate: null;
  isAutoUndeployNotified: boolean;
  isAutoDeleteNotified: boolean;
  isComputePolicyCompliant: boolean;
  vmSizingPolicyId: string;
  vmPlacementPolicyId: null;
  encrypted: boolean;
  dateCreated: Date;
  totalStorageAllocatedMb: number;
  isExpired: boolean;
  defaultStoragePolicyName: null;
  hasVgpuPolicy: boolean;
}

export interface RecordOtherAttributes {
  vmToolsVersion: string;
  taskStatusName: string;
  task: string;
  isVdcEnabled: string;
  pvdcHighestSupportedHardwareVersion: string;
  taskStatus: string;
  taskDetails: string;
}
