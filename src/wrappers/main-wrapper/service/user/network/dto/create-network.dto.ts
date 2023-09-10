import {
  CreateNetworkBody,
  IpRanges,
} from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/network/dto/create-network.dto';

class NetworkDto extends CreateNetworkBody {
  authToken: string;
  connectionType: string;
  connectionTypeValue: string;
  vdcId: string;
  dnsServer1: string;
  dnsServer2: string;
  dnsSuffix: string;
  gateway: string;
  ipRanges: IpRanges;
  prefixLength: number;
}

export type CreateNetworkDto = Omit<NetworkDto, 'connection' | 'enabled'>;
