import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsObject } from 'class-validator';
import { IpSecVpnSecurityTypeEnum } from '../enum/ip-sec-vpn-security-type.enum';
import { IpSecVpnIkeVersionEnum } from '../enum/ip-sec-vpn-ike-version.enum';
import {
  IpSecVpnIkeEncryptionAlgorithmEnum,
  IpSecVpnTunnelEncryptionAlgorithmEnum,
} from '../enum/ip-sec-vpn-encryption-algorithm.enum';
import { IpSecVpnDigestAlgorithmEnum } from '../enum/ip-sec-vpn-digest-algorithm.enum';
import { IpSecVpnDhGroupVersionEnum } from '../enum/ip-sec-vpn-dh-group-version.enum';
import { IpSecVpnDfPolicyEnum } from '../enum/ip-sec-vpn-df-policy.enum';

export class UpdateIpSecVpnConnectionPropertyIkeConfigurationVdc {
  @ApiProperty({
    type: String,
    required: true,
    example: IpSecVpnIkeVersionEnum.IKE_V2,
    default: IpSecVpnIkeVersionEnum.IKE_V2,
    description: `${IpSecVpnIkeVersionEnum.IKE_V1}  or ${IpSecVpnIkeVersionEnum.IKE_V2} or ${IpSecVpnIkeVersionEnum.IKE_FLEX}`,
  })
  @IsEnum(IpSecVpnIkeVersionEnum)
  ikeVersion: IpSecVpnIkeVersionEnum;

  @ApiProperty({
    type: Array(String),
    required: true,
    example: [IpSecVpnIkeEncryptionAlgorithmEnum.AES_128],
    default: [IpSecVpnIkeEncryptionAlgorithmEnum.AES_128],
  })
  encryptionAlgorithms: IpSecVpnIkeEncryptionAlgorithmEnum[];

  @ApiProperty({
    type: Array(String),
    required: false,
    example: [IpSecVpnDigestAlgorithmEnum.SHA2_256],
    default: [IpSecVpnDigestAlgorithmEnum.SHA2_256],
  })
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];

  @ApiProperty({
    type: Array(String),
    required: true,
    example: [IpSecVpnDhGroupVersionEnum.GROUP14],
    default: [IpSecVpnDhGroupVersionEnum.GROUP14],
  })
  dhGroups: IpSecVpnDhGroupVersionEnum[];

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  saLifeTime: number;
}

export class UpdateIpSecVpnConnectionPropertyTunnelConfigurationVdc {
  @ApiProperty({
    type: Boolean,
    example: true,
    default: true,
    description:
      'If true, perfect forward secrecy is active. The default value is true',
  })
  @IsBoolean()
  perfectForwardSecrecyActive: boolean;

  @ApiProperty({
    type: String,
    default: IpSecVpnDfPolicyEnum.COPY,
    example: IpSecVpnDfPolicyEnum.COPY,
  })
  @IsEnum(IpSecVpnDfPolicyEnum)
  dfPolicy: IpSecVpnDfPolicyEnum;

  @ApiProperty({
    type: Array(String),
    default: [IpSecVpnDigestAlgorithmEnum.SHA1],
    example: [IpSecVpnDigestAlgorithmEnum.SHA1],
  })
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];

  @ApiProperty({
    type: Array(String),
    default: [IpSecVpnTunnelEncryptionAlgorithmEnum.AES_GCM_128],
    example: [IpSecVpnTunnelEncryptionAlgorithmEnum.AES_GCM_128],
  })
  encryptionAlgorithms?: IpSecVpnTunnelEncryptionAlgorithmEnum[];

  @ApiProperty({
    type: Array(String),
    default: [IpSecVpnDhGroupVersionEnum.GROUP14],
    example: [IpSecVpnDhGroupVersionEnum.GROUP14],
  })
  dhGroups: IpSecVpnDhGroupVersionEnum[];

  @ApiProperty({
    type: Number,
    minimum: 900,
    maximum: 31536000,
    default: 3600,
    example: 3600,
    description:
      'The Security Association life time in seconds. Default is 3600 seconds.',
  })
  @IsNumber()
  saLifeTime: number;
}

export class UpdateIpSecVpnConnectionPropertyVdcDto {
  @ApiProperty({
    type: String,
    description:
      'security type in create is DEFAULT but when you changing config must be CUSTOM',
    example: IpSecVpnSecurityTypeEnum.CUSTOM,
    default: IpSecVpnSecurityTypeEnum.CUSTOM,
  })
  @IsEnum(IpSecVpnSecurityTypeEnum)
  securityType: IpSecVpnSecurityTypeEnum;

  @ApiProperty({
    type: UpdateIpSecVpnConnectionPropertyIkeConfigurationVdc,
    description: 'ikeConfiguration for this ip sec vpn',
    required: true,
  })
  @IsObject()
  ikeConfiguration: UpdateIpSecVpnConnectionPropertyIkeConfigurationVdc;

  @ApiProperty({
    type: UpdateIpSecVpnConnectionPropertyTunnelConfigurationVdc,
  })
  @IsObject()
  tunnelConfiguration: UpdateIpSecVpnConnectionPropertyTunnelConfigurationVdc;

  @ApiProperty({
    type: Number,
    minimum: 3,
    maximum: 60,
    description:
      'This configuration determines the number of seconds to wait in time between probes',
    default: 60,
    example: 60,
  })
  @IsNumber()
  dpdProbeInterval: number;
}
