export interface GetVMAttachedNamedDiskDto {
  otherAttributes: Record<string, never>;
  link: [];
  href: string;
  type: string;
  vmReference: VMReference[];
  vCloudExtension: [];
}

export interface VMReference {
  otherAttributes: Record<string, never>;
  href: string;
  id: null;
  type: string;
  name: string;
  vCloudExtension: [];
}
