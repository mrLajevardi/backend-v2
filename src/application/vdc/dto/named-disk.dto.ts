import { ApiProperty } from '@nestjs/swagger';

export class NamedDiskAttachedVms {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;
}
export class NamedDiskDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number, example: 1024 })
  sizeMb: number;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Boolean, example: false })
  isAttached: boolean;

  @ApiProperty({ type: String })
  ownerName: string;

  @ApiProperty({ type: String, example: 'RESOLVED' })
  status: string;

  @ApiProperty({ type: Number, example: 1 })
  attachedVmCount: number;

  @ApiProperty({ type: [NamedDiskAttachedVms] })
  attachedVms: NamedDiskAttachedVms[];

  @ApiProperty({ type: Number, example: 6 })
  busType: number;

  @ApiProperty({ type: String, example: 'ahci' })
  busSubType: string;

  @ApiProperty({ type: String, example: 'None' })
  sharingType: string;

  @ApiProperty({ type: String, example: 'SATA' })
  busTypeDesc: string;

  @ApiProperty({ type: String })
  policyId: string;
}
