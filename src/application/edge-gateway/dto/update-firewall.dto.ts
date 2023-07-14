import { ApiProperty } from '@nestjs/swagger';
import { FirewallDto } from './firewall.dto';

export class UpdateFirewallDto {
  @ApiProperty({ type: [FirewallDto] })
  firewallList: FirewallDto[];
}
