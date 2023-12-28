import { ApiProperty } from '@nestjs/swagger';
import { FirewallListItemDto } from './firewall-list-item.dto';
import { IsArray, IsObject, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFirewallDto {
  @ApiProperty({ type: [FirewallListItemDto] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => FirewallListItemDto)
  @ValidateNested({ each: true })
  userDefinedRules: FirewallListItemDto[];

  @ApiProperty({ type: [FirewallListItemDto] })
  @IsArray()
  @IsObject({ each: true })
  @Type(() => FirewallListItemDto)
  @ValidateNested({ each: true })
  @ValidateIf((object, value) => value.length !== 0)
  defaultRules: FirewallListItemDto[];
}
