import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';
import { ApplicationRefDto } from './application-ref.dto';
import { FirewallGroupDto } from './firewall-group.dto';

export class FirewallListItemDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ type: [ApplicationRefDto] })
  applicationPortProfiles: ApplicationRefDto[];

  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  ruleType: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsDefined()
  enabled: boolean;

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsDefined()
  sourceFirewallGroups: FirewallGroupDto[];

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsDefined()
  destinationFirewallGroups: FirewallGroupDto[];

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;
}
