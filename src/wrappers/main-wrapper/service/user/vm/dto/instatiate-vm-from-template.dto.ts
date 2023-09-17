import { ApiProperty } from '@nestjs/swagger';
import { Networks } from './create-vm.dto';

export class CreateVmFromTemplate {
  @ApiProperty({ type: [Networks] })
  networks: Networks[];

  @ApiProperty({
    type: String,
    description: 'source template name',
    example: 'template-1',
  })
  sourceName: string;

  @ApiProperty({
    type: String,
    description: 'template id',
    example: 'vappTemplate-15c606aa-b4b1-45ca-b4c5-867cf59184cf',
  })
  sourceId: string;

  @ApiProperty({ type: String, example: 'vm-1', description: 'vm name' })
  name: string;

  @ApiProperty({ type: Boolean })
  powerOn: boolean;

  @ApiProperty({ type: String, example: 'vm number 1' })
  description: string;

  @ApiProperty({ type: Number })
  primaryNetworkIndex: number;

  @ApiProperty({ type: String, example: 'vm-1' })
  computerName: string;
}
export class InstantiateVmTemplateDto extends CreateVmFromTemplate {
  sourceHref: string;
}

export interface OrgVdcStorageProfileQuery {
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
  isVdcBusy: boolean;
  diskIopsEnabled: boolean;
  diskIopsDefault: number;
  diskIopsMax: number;
  diskIopsPerGbMax: number;
  ignoreIopsPlacement: boolean;
  numberOfCapabilities: null;
  inheritPvdcDefaultSettings: boolean;
}
