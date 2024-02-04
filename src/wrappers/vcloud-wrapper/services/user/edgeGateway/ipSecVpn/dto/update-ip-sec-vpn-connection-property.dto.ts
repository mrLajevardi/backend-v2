import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';
import { IpSecVpnIkeVersionEnum } from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-ike-version.enum';
import {
  IpSecVpnIkeEncryptionAlgorithmEnum,
  IpSecVpnTunnelEncryptionAlgorithmEnum,
} from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-encryption-algorithm.enum';
import { IpSecVpnDigestAlgorithmEnum } from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-digest-algorithm.enum';
import { IpSecVpnDhGroupVersionEnum } from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-dh-group-version.enum';
import { IpSecVpnDfPolicyEnum } from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-df-policy.enum';
import { IpSecVpnSecurityTypeEnum } from '../../../../../../../application/edge-gateway/enum/ip-sec-vpn-security-type.enum';

export interface UpdateIpSecVpnConnectionPropertyDto
  extends EndpointOptionsInterface {
  gatewayId: string;
  ipSecVpnId: string;
  body: UpdateIpSecVpnConnectionPropertyBody;
}

export class UpdateIpSecVpnConnectionPropertyBody {
  securityType: string = IpSecVpnSecurityTypeEnum.CUSTOM;
  ikeConfiguration: UpdateIpSecVpnConnectionPropertyIkeConfiguration;
  tunnelConfiguration: UpdateIpSecVpnConnectionPropertyTunnelConfiguration;
  dpdProbeInterval: number;
}

export class UpdateIpSecVpnConnectionPropertyIkeConfiguration {
  ikeVersion: IpSecVpnIkeVersionEnum;
  encryptionAlgorithms: IpSecVpnIkeEncryptionAlgorithmEnum[];
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];
  dhGroups: IpSecVpnDhGroupVersionEnum[];
  saLifeTime: number;
}

export class UpdateIpSecVpnConnectionPropertyTunnelConfiguration {
  perfectForwardSecrecyActive: boolean;
  dfPolicy: IpSecVpnDfPolicyEnum;
  digestAlgorithms?: IpSecVpnDigestAlgorithmEnum[];
  encryptionAlgorithms?: IpSecVpnTunnelEncryptionAlgorithmEnum[];
  dhGroups: IpSecVpnDhGroupVersionEnum[];
  saLifeTime: number;
}
