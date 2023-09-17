import { ApiProperty } from '@nestjs/swagger';
import { NetworkAdapterTypes } from '../../vdc/dto/get-hard-disk-adaptors.dto';

export class CreateVmDto {
  computerName: string;
  coreNumber: number;
  cpuNumber: number;
  mediaName: string;
  mediaHref: string;
  name: string;
  primaryNetworkIndex: number;
  osType: string;
  ram: number;
  storage: Storage[];
  networks: Networks[];
  powerOn: boolean;
  description: string;
}
export enum AllocationModes {
  NONE = 'NONE',
  DHCP = 'DHCP',
  POOL = 'POOL',
  MANUAL = 'MANUAL',
}
export class Networks {
  @ApiProperty({ type: String, example: 'default-network' })
  networkName: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  ipAddress: string;

  @ApiProperty({ type: Boolean })
  isConnected: boolean;

  @ApiProperty({
    type: String,
    enum: AllocationModes,
  })
  allocationMode: AllocationModes;

  @ApiProperty({
    type: String,
    enum: NetworkAdapterTypes,
  })
  networkAdaptorType: NetworkAdapterTypes;
}

class Storage {
  sizeMb: number;
}
