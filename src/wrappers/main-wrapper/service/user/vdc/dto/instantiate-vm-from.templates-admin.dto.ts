export interface AdminOrgVdcStorageProfileQuery {
  otherAttributes: OtherAttributes;
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
  otherAttributes: OtherAttributes;
  href: string;
  id: null;
  type: string;
  name: null;
  rel: string;
  model: null | string;
  vCloudExtension: any[];
}

type OtherAttributes = Record<string, never>;

export interface Records {
  _type: string;
  link: Link[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: OtherAttributes;
  name: string;
  isEnabled: boolean;
  isDefaultStorageProfile: boolean;
  storageUsedMB: number;
  storageLimitMB: number;
  iopsAllocated: number;
  iopsLimit: number;
  numberOfConditions: number;
  vdc: string;
  vdcName: string;
  org: string;
  vc: string;
  storageProfileMoref: string;
  diskIopsEnabled: boolean;
  diskIopsDefault: number;
  diskIopsMax: number;
  diskIopsPerGbMax: number;
  ignoreIopsPlacement: boolean;
  numberOfCapabilities: number;
  inheritPvdcDefaultSettings: boolean;
}
