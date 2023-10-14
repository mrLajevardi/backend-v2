export interface ProviderVdcStorageProfilesDto {
  otherAttributes: LinkOtherAttributes;
  link: Link[];
  href: string;
  type: string;
  name: string;
  page: number;
  pageSize: number;
  total: number;
  record: Records[];
  vCloudExtension: any[];
}

export interface Link {
  otherAttributes: LinkOtherAttributes;
  href: string;
  id: null;
  type: string;
  name: null;
  rel: Rel;
  model: Model | null;
  vCloudExtension: any[];
}

export enum Model {
  Capabilities = 'Capabilities',
  StoragePolicySettings = 'StoragePolicySettings',
  StoragePolicySupportedEntityTypes = 'StoragePolicySupportedEntityTypes',
}

export type LinkOtherAttributes = Record<string, never>;

export enum Rel {
  Alternate = 'alternate',
  Down = 'down',
  Edit = 'edit',
  LastPage = 'lastPage',
  NextPage = 'nextPage',
}

export interface Records {
  _type: string;
  link: Link[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: RecordOtherAttributes;
  isEnabled: boolean;
  name: string;
  storageTotalMB: number;
  storageUsedMB: number;
  storageRequestedMB: number;
  storageProvisionedMB: number;
  numberOfConditions: number;
  providerVdc: string;
  vc: string;
  storageProfileMoref: string;
  iopsCapacity: number;
  iopsAllocated: number;
  numberOfCapabilities: number;
  iopsLimitingEnabled: boolean;
}

export interface RecordOtherAttributes {
  site: string;
  locationId: string;
  siteName: string;
}
