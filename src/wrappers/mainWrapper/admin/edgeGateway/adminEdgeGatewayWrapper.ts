import { createEdgeGateway } from './createEdgeGateway';
import { getAvailableIpAddresses } from './getAvailableIpAddresses';
import { getEdgeCluster } from './getEdgeCluster';
import { getExternalNetworks } from './getExternalNetworks';

export const adminEdgeGatewayWrapper = {
  createEdgeGateway: createEdgeGateway,
  getAvailableIpAddresses: getAvailableIpAddresses,
  getExternalNetworks: getExternalNetworks,
  getEdgeClusters: getEdgeCluster,
};
