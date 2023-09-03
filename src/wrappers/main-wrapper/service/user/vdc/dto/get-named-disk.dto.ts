export interface GetNamedDiskDto {
  otherAttributes: [];
  link: Link[];
  href: string;
  type: string;
  name: string;
  page: number;
  pageSize: number;
  total: number;
  record: Records[];
  vCloudExtension: [];
}

export interface Link {
  otherAttributes: [];
  href: string;
  id: null;
  type: null | string;
  name: null;
  rel: string;
  model: null;
  vCloudExtension: any[];
}

export interface Records {
  _type: string;
  link: Link[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: RecordOtherAttributes;
  name: string;
  vdc: string;
  description: string;
  sizeMb: number;
  iopsReservation: number;
  iopsLimit: number;
  encrypted: null;
  uuid: string;
  datastore: null;
  datastoreName: null;
  ownerName: string;
  vdcName: string;
  task: null;
  storageProfile: string;
  storageProfileName: string;
  status: string;
  busType: string;
  busTypeDesc: string;
  busSubType: string;
  attachedVmCount: number;
  isAttached: boolean;
  isShareable: boolean;
  sharingType: string;
}

export interface RecordOtherAttributes {
  isVdcEnabled: string;
}
