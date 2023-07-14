import { ApiProperty } from '@nestjs/swagger';
import { FirewallListItemDto } from './firewall-list-item.dto';

export class FirewalListDto {
  @ApiProperty({ type: [FirewallListItemDto] })
  defaultRules: FirewallListItemDto[];

  @ApiProperty({ type: [FirewallListItemDto] })
  systemRules: FirewallListItemDto[];

  @ApiProperty({ type: [FirewallListItemDto] })
  userDefinedRules: FirewallListItemDto[];
}
