import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateNetworkProfileDto extends EndpointOptionsInterface {
  urlParams: UpdateNetworkProfileUrlParams;
  body: UpdateNetworkProfileBody;
}

interface UpdateNetworkProfileUrlParams {
  vdcId: string;
}

export class UpdateNetworkProfileBody {
  primaryEdgeCluster: null;
  secondaryEdgeCluster: null;
  servicesEdgeCluster: ServicesEdgeCluster;
  vdcNetworkSegmentProfileTemplateRef: null;
  vappNetworkSegmentProfileTemplateRef: null;
}

class ServicesEdgeCluster {
  backingId: string;
}
