export interface GetProviderVdcsMetadataDto {
  otherAttributes: OtherAttributes;
  link: Link[];
  href: string;
  type: string;
  metadataEntry: MetadataEntry[];
  vCloudExtension: any[];
}

export interface Link {
  otherAttributes: OtherAttributes;
  href: string;
  id: null;
  type: null | string;
  name: null;
  rel: string;
  model: null;
  vCloudExtension: [];
}

export type OtherAttributes = Record<string, never>;

export interface MetadataEntry {
  otherAttributes: OtherAttributes;
  link: Link[];
  href: string;
  type: string;
  domain: null;
  key: string;
  typedValue: TypedValue;
  vCloudExtension: [];
}

export interface TypedValue {
  _type: string;
  value: string | boolean | number;
}
