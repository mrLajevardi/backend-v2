import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class DhcpForwarderDto {
  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: [String], required: true, default: [] })
  @IsString({ each: true })
  dhcpServers: string[];

  @ApiProperty({ type: Number, required: true })
  version: number;
}
