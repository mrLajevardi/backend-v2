import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableResourcesQueryDto {
  @ApiProperty({ type: String })
  datacenterName: string;
}

export class GetAvailableIps {
  @ApiProperty({ type: Number })
  totalIpCount: number;

  @ApiProperty({ type: Number })
  usedIpCount: number;
}

export class StoragePoliciesList {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  storageTotalMB: number;

  @ApiProperty({ type: Number })
  storageUsedMB: number;
}

class ComputeCapacityItem {
  @ApiProperty({ type: Number })
  allocation: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  used: number;

  @ApiProperty({ type: Number })
  reserved: number;
}

class CpuComputeCapacity extends ComputeCapacityItem {
  @ApiProperty({ type: Number })
  cpuSpeed: number;
}
export class ComputeCapacity {
  @ApiProperty({ type: ComputeCapacityItem })
  cpu: CpuComputeCapacity;

  @ApiProperty({ type: ComputeCapacityItem })
  ram: ComputeCapacityItem;
}

export class ProviderVdcResourceList {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: StoragePoliciesList })
  storagePolicies: StoragePoliciesList[];

  @ApiProperty({ type: ComputeCapacity })
  computeCapacity: ComputeCapacity;
}

export class GetAvailableResourcesDto {
  @ApiProperty({ type: GetAvailableIps })
  providerGateway: GetAvailableIps;

  @ApiProperty({ type: [ProviderVdcResourceList] })
  providerVdc: ProviderVdcResourceList[];
}
