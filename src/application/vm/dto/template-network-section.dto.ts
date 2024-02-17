import { ApiProperty } from '@nestjs/swagger';
import { AllocationModes } from '../../../wrappers/main-wrapper/service/user/vm/dto/create-vm.dto';
import { NetworkAdapterTypes } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-hard-disk-adaptors.dto';

export class TemplateNetworkSection {
  @ApiProperty({ type: Number })
  networkConnectionIndex: number;

  @ApiProperty({ type: Boolean })
  isConnected: boolean;

  @ApiProperty({ enum: AllocationModes })
  ipAddressAllocationMode: AllocationModes;

  @ApiProperty({ enum: NetworkAdapterTypes })
  networkAdapterType: NetworkAdapterTypes;

  @ApiProperty({ type: String })
  network: string;

  @ApiProperty({ type: Boolean })
  needsCustomization: boolean;

  @ApiProperty({ type: String })
  macAddress: string;

  @ApiProperty({ type: Boolean })
  isPrimary: boolean;
}
