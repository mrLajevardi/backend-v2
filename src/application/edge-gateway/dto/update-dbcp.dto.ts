import { ApiProperty } from '@nestjs/swagger';
import { DhcpPoolsDto } from './dhcp-pools.dto';

export class UpdateDhcpDto {
  @ApiProperty({ type: Number })
  leaseTime: number;

  @ApiProperty({ type: String })
  ipAddress: string;

  @ApiProperty({ type: [DhcpPoolsDto] })
  dhcpPools: DhcpPoolsDto[];

  @ApiProperty({ type: String })
  mode: string;

  @ApiProperty({ type: [String] })
  dnsServers: string[];
}
