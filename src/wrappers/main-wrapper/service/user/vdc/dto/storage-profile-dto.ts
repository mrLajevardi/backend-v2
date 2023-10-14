export interface StorageProfilesDto {
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
  rel: string;
  model: null;
  vCloudExtension: any[];
}

export type LinkOtherAttributes = Record<string, never>;

export interface Records {
  _type: string;
  link: any[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: RecordsOtherAttributes;
  name: string;
  numberOfProviderVdcs: number;
  numberOfOrgVdcs: number;
  numberOfDatastores: number;
  requestedMb: number;
  totalMb: number;
  usedMb: number;
  provisionedMb: number;
  capabilities: string;
  numberOfCapabilities: number;
}

export interface RecordsOtherAttributes {
  site: string;
  locationId: string;
  siteName: string;
}
