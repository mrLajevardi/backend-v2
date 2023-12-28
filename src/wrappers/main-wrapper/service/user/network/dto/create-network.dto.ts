import {
  Connection,
  CreateNetworkBody,
} from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/network/dto/create-network.dto';

export class CreateNetworkDto {
  authToken: string;
  connectionType: string;
  connectionTypeValue: string;
  vdcId: string;
  dnsServer1: string;
  dnsServer2: string;
  dnsSuffix: string;
  gateway: string;
  prefixLength: number;
  name: string;
  networkType: string;
  description: string;
  enabled?: boolean;
}
