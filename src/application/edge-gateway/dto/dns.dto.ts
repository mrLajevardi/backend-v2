import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class DnsDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsDefined()
  enabled: boolean;

  @ApiProperty({ type: Number })
  listenerIp: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  displayName: string;

  @ApiProperty({ type: [String] })
  @IsDefined()
  upstreamServers: string[];

  @ApiProperty({ type: String })
  conditionalForwarderZones: string;

  @ApiProperty({ type: String })
  version: string;

  @ApiProperty({ type: String })
  snatRuleEnabled: string;
}
