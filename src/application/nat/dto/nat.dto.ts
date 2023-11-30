import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApplicationRefDto } from 'src/application/edge-gateway/dto/application-ref.dto';
import { NatFirewallMatchEnum } from 'src/wrappers/main-wrapper/service/user/nat/enum/nat-firewall-match.enum';
import { NatTypes } from 'src/wrappers/main-wrapper/service/user/nat/enum/nat-types.enum';

export class NatDto {
  @ApiProperty({ type: String, required: true, example: 'test' })
  @IsString()
  name: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ type: Number, required: true, example: 2 })
  @IsNumber()
  @Min(0)
  priority: number;

  @ApiProperty({
    type: NatFirewallMatchEnum,
    enum: NatFirewallMatchEnum,
  })
  @IsEnum(NatFirewallMatchEnum)
  firewallMatch: NatFirewallMatchEnum;

  @ApiProperty({ type: NatTypes, enum: NatTypes })
  @IsEnum(NatTypes)
  type: NatTypes;

  @ApiProperty({ type: String, required: true, example: '192.168.1.1' })
  @IsString()
  externalIP: string;

  @ApiProperty({ type: Number, default: '', example: '22' })
  @IsNumber()
  @IsOptional()
  externalPort?: number;

  @ApiProperty({ type: String, required: true, example: '192.168.1.1' })
  @IsString()
  internalIP: string;

  @ApiProperty({ type: ApplicationRefDto })
  applicationPortProfile?: ApplicationRefDto;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String, example: '192.168.1.1' })
  @IsString()
  destinationIP?: string;
}

export class NatQueryDto {
  @ApiProperty({ type: Boolean })
  @Transform((prop) => JSON.parse(prop.value))
  @IsBoolean()
  getAll: boolean;

  @ApiProperty({ type: Number })
  @Transform((prop) => Number(prop.value))
  @IsNumber()
  @Min(1)
  @Max(128)
  pageSize: number;
}
