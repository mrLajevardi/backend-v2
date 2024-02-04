import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IpSecVpnSecurityTypeEnum } from '../../enum/ip-sec-vpn-security-type.enum';
import { IpSecVpnIkeVersionEnum } from '../../enum/ip-sec-vpn-ike-version.enum';
import { IpSecVpnDhGroupVersionEnum } from '../../enum/ip-sec-vpn-dh-group-version.enum';
import { IpSecVpnDigestAlgorithmEnum } from '../../enum/ip-sec-vpn-digest-algorithm.enum';
import {
  IpSecVpnIkeEncryptionAlgorithmEnum,
  IpSecVpnTunnelEncryptionAlgorithmEnum,
} from '../../enum/ip-sec-vpn-encryption-algorithm.enum';
import { IpSecVpnDfPolicyEnum } from '../../enum/ip-sec-vpn-df-policy.enum';

export class IpSecVpnConnectionPropertyTunnelConfigurationResultType {
  @ApiResponseProperty({
    type: Boolean,
  })
  perfectForwardSecrecyActive: boolean;

  @ApiResponseProperty({
    type: String,
    enum: IpSecVpnDfPolicyEnum,
  })
  dfPolicy: string;

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnDhGroupVersionEnum,
  })
  dhGroups: string[];

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnDigestAlgorithmEnum,
  })
  digestAlgorithms?: string[];

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnTunnelEncryptionAlgorithmEnum,
  })
  encryptionAlgorithms: string[];

  @ApiResponseProperty({
    type: Number,
  })
  saLifeTime: number;
}

export class IpSecVpnConnectionPropertyIkeConfigurationResultType {
  @ApiResponseProperty({
    type: String,
    enum: IpSecVpnIkeVersionEnum,
  })
  ikeVersion: string;

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnDhGroupVersionEnum,
  })
  dhGroups: string[];

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnDigestAlgorithmEnum,
  })
  digestAlgorithms: string[];

  @ApiResponseProperty({
    type: Array(String),
    enum: IpSecVpnIkeEncryptionAlgorithmEnum,
  })
  encryptionAlgorithms: string[];

  @ApiResponseProperty({
    type: Number,
  })
  saLifeTime: number;
}

export class IpSecVpnConnectionPropertyResultType {
  @ApiResponseProperty({
    type: String,
    enum: IpSecVpnSecurityTypeEnum,
  })
  securityType: string;

  @ApiResponseProperty({
    type: IpSecVpnConnectionPropertyIkeConfigurationResultType,
  })
  ikeConfiguration: IpSecVpnConnectionPropertyIkeConfigurationResultType;

  @ApiResponseProperty({
    type: IpSecVpnConnectionPropertyTunnelConfigurationResultType,
  })
  tunnelConfiguration: IpSecVpnConnectionPropertyTunnelConfigurationResultType;

  @ApiResponseProperty({
    type: Number,
  })
  dpdProbeInterval: number;
}

export class IpSecVpnConnectionPropertyResultDto extends BaseResultDto {
  collection(items: IpSecVpnConnectionPropertyResultType[]): any[] {
    return items.map((item: IpSecVpnConnectionPropertyResultType) => {
      return this.toArray(item);
    });
  }

  toArray(
    item: IpSecVpnConnectionPropertyResultType,
  ): IpSecVpnConnectionPropertyResultType {
    return {
      securityType: item.securityType,
      dpdProbeInterval: item.dpdProbeInterval,
      ikeConfiguration: item.ikeConfiguration,
      tunnelConfiguration: item.tunnelConfiguration,
    };
  }
}
