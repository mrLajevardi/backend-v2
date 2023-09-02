import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateIpSetsDto extends EndpointOptionsInterface {
  urlParams: UpdateIpSetsUrlParams;
  body: UpdateIpSetBody;
}
export interface UpdateIpSetsUrlParams {
  ipSetId: string;
}

interface UpdateIpSetBody {
  name: string;
  description: string;
  ipAddresses: string[];
  ownerRef: OwnerRef;
  typeValue: string;
}

interface OwnerRef {
  id: string;
}
