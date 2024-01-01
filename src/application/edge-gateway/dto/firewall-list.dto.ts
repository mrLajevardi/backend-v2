import { ApiProperty } from '@nestjs/swagger';
import { FirewallListItemDto } from './firewall-list-item.dto';

export class FirewallListDto {
  @ApiProperty({ type: [FirewallListItemDto] })
  defaultRules: FirewallListItemDto[];

  @ApiProperty({ type: [FirewallListItemDto] })
  systemRules: FirewallListItemDto[];

  @ApiProperty({ type: [FirewallListItemDto] })
  userDefinedRules: FirewallListItemDto[];
}
