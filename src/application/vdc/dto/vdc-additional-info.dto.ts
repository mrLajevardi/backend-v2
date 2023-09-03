import { ApiProperty } from '@nestjs/swagger';

export class VdcAdditionalInfoDto {
  @ApiProperty({ type: Number })
  memoryUsedMB: number;

  @ApiProperty({ type: Number })
  memoryAllocationMB: number;

  @ApiProperty({ type: Number })
  cpuAllocation: number;

  @ApiProperty({ type: Number })
  cpuUsed: number;

  @ApiProperty({ type: Number })
  numberOfVMs: number;

  @ApiProperty({ type: Number })
  storageLimitMB: number;

  @ApiProperty({ type: Number })
  storageUsedMB: number;

  @ApiProperty({ type: Number })
  numberOfRunningVMs: number;
}
