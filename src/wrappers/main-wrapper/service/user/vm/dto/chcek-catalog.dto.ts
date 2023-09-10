export interface CheckCatalogDto {
  otherAttributes: OtherAttributes;
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
  otherAttributes: OtherAttributes;
  href: string;
  id: null;
  type: string;
  name: null;
  rel: string;
  model: null;
  vCloudExtension: [];
}

type OtherAttributes = Record<string, never>;

export interface Records {
  _type: string;
  link: any[];
  metadata: null;
  href: string;
  id: null;
  type: null;
  otherAttributes: OtherAttributes;
  name: string;
  description: string;
  isPublished: boolean;
  isShared: boolean;
  creationDate: Date;
  orgName: string;
  ownerName: string;
  numberOfVAppTemplates: number;
  numberOfMedia: number;
  owner: string;
  publishSubscriptionType: string;
  version: number;
  status: string;
  isLocal: boolean;
}
