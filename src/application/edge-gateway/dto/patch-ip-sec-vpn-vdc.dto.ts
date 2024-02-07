import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { IpSecVpnAuthModeEnum } from '../enum/ip-sec-vpn-auth-mode.enum';

export class PatchIpSecVpnLocalVdcDto {
  @ApiProperty()
  @IsString()
  localId: string;

  @ApiProperty()
  @IsString()
  localAddress: string;

  @ApiProperty()
  @IsArray({
    each: true,
  })
  localNetworks: string[];
}

export class PatchIpSecVpnRemoteVdcDto {
  @ApiProperty()
  @IsString()
  remoteId: string;

  @ApiProperty()
  @IsString()
  remoteAddress: string;

  @ApiProperty({
    type: Array(String),
  })
  @IsArray({
    each: true,
  })
  remoteNetworks: string[];
}

export class PatchIpSecVpnVdcDto {
  @ApiProperty({
    type: String,
    description: 'name for ip sec vpn',
    example: 'test-name',
    default: 'test-name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'description for ip sec vpn, is optional',
    example: 'test-description',
    default: 'test-description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: String,
    description:
      'securityType for ip sec vpn, is must be DEFAULT for this version',
    example: 'DEFAULT',
    default: 'DEFAULT',
  })
  @IsString()
  @IsOptional()
  securityType?: string;

  @ApiProperty({
    type: Boolean,
    description: 'active ip sec vpn , true or false',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active? = true;

  @ApiProperty({
    description:
      'authenticationMode is must be PSK in this version (pre-shared-key or certificate)',
    example: IpSecVpnAuthModeEnum.psk,
    default: IpSecVpnAuthModeEnum.psk,
  })
  @IsEnum(IpSecVpnAuthModeEnum)
  @IsOptional()
  authenticationMode?: IpSecVpnAuthModeEnum;

  @ApiProperty({
    description:
      "pre shared key for ip sec , it's same as password for tunnels",
  })
  @IsString()
  @IsOptional()
  preSharedKey?: string;

  @ApiProperty({
    type: PatchIpSecVpnLocalVdcDto,
  })
  @IsOptional()
  localEndpoint?: PatchIpSecVpnLocalVdcDto;

  @ApiProperty({
    type: PatchIpSecVpnRemoteVdcDto,
  })
  @IsOptional()
  remoteEndpoint?: PatchIpSecVpnRemoteVdcDto;
}
