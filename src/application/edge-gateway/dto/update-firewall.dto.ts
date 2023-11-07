import { ApiProperty } from '@nestjs/swagger';
import { FirewallListItemDto } from './firewall-list-item.dto';

export class UpdateFirewallDto {
  @ApiProperty({ type: [FirewallListItemDto] })
  firewallList: FirewallListItemDto[];
}
