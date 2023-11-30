import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApplicationRefDto } from './application-ref.dto';
import { FirewallGroupDto } from './firewall-group.dto';
import { Type } from 'class-transformer';
import { FirewallActionValue } from 'src/wrappers/main-wrapper/service/user/firewall/enum/firewall-action-value.enum';

export class FirewallListItemDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ type: [ApplicationRefDto] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => ApplicationRefDto)
  @ValidateNested({ each: true })
  @ValidateIf((object, value) => value !== null)
  applicationPortProfiles: ApplicationRefDto[];

  @ApiProperty({ type: FirewallActionValue, enum: FirewallActionValue })
  @IsEnum(FirewallActionValue)
  @IsDefined()
  actionValue: FirewallActionValue;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsDefined()
  enabled: boolean;

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => FirewallGroupDto)
  @ValidateNested({ each: true })
  @ValidateIf((object, value) => value !== null)
  sourceFirewallGroups: FirewallGroupDto[];

  @ApiProperty({ type: [FirewallGroupDto] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => FirewallGroupDto)
  @ValidateNested({ each: true })
  @ValidateIf((object, value) => value !== null)
  destinationFirewallGroups: FirewallGroupDto[];

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  comments: string;
}
