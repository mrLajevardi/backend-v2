import { ApiProperty } from '@nestjs/swagger';
export type BusSubType = 'vmware.sata.ahci' | 'vmware.nvme.controller';

export class CreateNamedDiskDto {
  @ApiProperty({ type: String, example: 'test' })
  name: string;

  @ApiProperty({ type: String, example: 'named disk for example vm' })
  description: string;

  @ApiProperty({ type: Number, example: 20 })
  busType: number;

  @ApiProperty({
    type: String,

    example: 'vmware.sata.ahci',
  })
  busSubType: BusSubType;

  @ApiProperty({ type: String, example: 'None' })
  sharingType: string;

  @ApiProperty({ type: Number, example: 1024 })
  size: number;
}
