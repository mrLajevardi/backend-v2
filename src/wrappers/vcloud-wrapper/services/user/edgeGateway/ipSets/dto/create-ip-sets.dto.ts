import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateIpSetsDto extends EndpointOptionsInterface {
  body: CreateIpSetBody;
}

interface CreateIpSetBody {
  name: string;
  description: string;
  ipAddresses: string[];
  ownerRef: OwnerRef;
  typeValue: string;
}

interface OwnerRef {
  id: string;
}
