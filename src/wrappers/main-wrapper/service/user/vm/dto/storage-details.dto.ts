export interface StorageDetails {
  otherAttributes?: OtherAttributes;
  link?: Link[];
  href?: string;
  type?: string;
  name?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  record?: Record[];
  vCloudExtension?: any[];
}

export interface Link {
  otherAttributes?: OtherAttributes;
  href?: string;
  id?: null;
  type?: string;
  name?: null;
  rel?: Rel;
  model?: null | string;
  vCloudExtension?: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OtherAttributes {}

export enum Rel {
  Alternate = 'alternate',
  Down = 'down',
  MakeDefault = 'makeDefault',
  Up = 'up',
}

export interface Record {
  _type?: string;
  link?: Link[];
  metadata?: null;
  href?: string;
  id?: null;
  type?: null;
  otherAttributes?: OtherAttributes;
  name?: string;
  isEnabled?: boolean;
  isDefaultStorageProfile?: boolean;
  storageUsedMB?: number;
  storageLimitMB?: number;
  iopsAllocated?: number;
  iopsLimit?: number;
  numberOfConditions?: number;
  vdc?: string;
  vdcName?: string;
  isVdcBusy?: boolean;
  diskIopsEnabled?: boolean;
  diskIopsDefault?: number;
  diskIopsMax?: number;
  diskIopsPerGbMax?: number;
  ignoreIopsPlacement?: boolean;
  numberOfCapabilities?: number;
  inheritPvdcDefaultSettings?: boolean;
}
