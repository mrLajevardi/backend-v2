import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationRefDto } from './application-ref.dto';
import { FirewallGroupDto } from './firewall-group.dto';

export class FirewallDto {
  @ApiProperty({ example: '9615c4c7-2354-48fc-9639-cc76875ad466' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: [ApplicationRefDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ApplicationRefDto)
  applicationPortProfiles?: ApplicationRefDto[];

  @ApiProperty({ example: 'DROP' })
  @IsNotEmpty()
  @IsString()
  ruleType: string;

  @ApiProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FirewallGroupDto)
  sourceFirewallGroups: FirewallGroupDto[];

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FirewallGroupDto)
  destinationFirewallGroups: FirewallGroupDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
