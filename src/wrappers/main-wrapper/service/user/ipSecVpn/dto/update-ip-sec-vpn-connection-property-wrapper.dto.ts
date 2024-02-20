import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IpSecVpnSecurityTypeEnum } from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-security-type.enum';
import { IpSecVpnIkeVersionEnum } from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-ike-version.enum';
import {
  IpSecVpnIkeEncryptionAlgorithmEnum,
  IpSecVpnTunnelEncryptionAlgorithmEnum,
} from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-encryption-algorithm.enum';
import { IpSecVpnDigestAlgorithmEnum } from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-digest-algorithm.enum';
import { IpSecVpnDhGroupVersionEnum } from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-dh-group-version.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IpSecVpnDfPolicyEnum } from '../../../../../../application/edge-gateway/enum/ip-sec-vpn-df-policy.enum';
export class UpdateIpSecVpnConnectionPropertyTunnelConfigurationWrapper {
  @IsBoolean()
  perfectForwardSecrecyActive: boolean;

  @IsEnum(IpSecVpnDfPolicyEnum)
  dfPolicy: IpSecVpnDfPolicyEnum;

  @ApiProperty({
    type: Array(IpSecVpnDigestAlgorithmEnum),
  })
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];

  @ApiProperty({
    type: Array(IpSecVpnTunnelEncryptionAlgorithmEnum),
  })
  encryptionAlgorithms?: IpSecVpnTunnelEncryptionAlgorithmEnum[];

  @ApiProperty({
    type: Array(IpSecVpnDhGroupVersionEnum),
  })
  dhGroups: IpSecVpnDhGroupVersionEnum[];

  @IsNumber()
  saLifeTime: number;
}

export class UpdateIpSecVpnConnectionPropertyIkeConfigurationWrapper {
  @IsEnum(IpSecVpnIkeVersionEnum)
  ikeVersion: IpSecVpnIkeVersionEnum;

  @ApiProperty({
    type: Array(IpSecVpnIkeEncryptionAlgorithmEnum),
    required: true,
  })
  encryptionAlgorithms: IpSecVpnIkeEncryptionAlgorithmEnum[];

  @ApiProperty({
    type: Array(IpSecVpnDigestAlgorithmEnum),
    required: false,
  })
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];

  @ApiProperty({
    type: Array(IpSecVpnDhGroupVersionEnum),
    required: true,
  })
  dhGroups: IpSecVpnDhGroupVersionEnum[];

  @IsNumber()
  saLifeTime: number;
}

export class UpdateIpSecVpnConnectionPropertyWrapperDto {
  @IsString()
  gatewayId: string;

  @IsString()
  ipSecVpnId: string;

  @IsEnum(IpSecVpnSecurityTypeEnum)
  securityType: string = IpSecVpnSecurityTypeEnum.CUSTOM;

  @ApiProperty({
    type: UpdateIpSecVpnConnectionPropertyIkeConfigurationWrapper,
  })
  @IsObject()
  ikeConfiguration: UpdateIpSecVpnConnectionPropertyIkeConfigurationWrapper;

  @ApiProperty({
    type: UpdateIpSecVpnConnectionPropertyTunnelConfigurationWrapper,
  })
  @IsObject()
  tunnelConfiguration: UpdateIpSecVpnConnectionPropertyTunnelConfigurationWrapper;

  @IsNumber()
  dpdProbeInterval: number;
}
