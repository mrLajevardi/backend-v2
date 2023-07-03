import { createEdgeGatewayEndpoint } from './createEdgeGatewayEndpoint';
import { getAvailableIpAddressesEndpoint } from './getAvailableIpAddressesEndpoint';
import { getExternalNetworksEndpoint } from './getExternalNetworks';
import { getNsxtEdgeClustersEndpoint } from './getNsxtEdgeClustersEndpoint';

export const adminEdgeGatewayEndpoints = {
  createEdgeGateway: createEdgeGatewayEndpoint,
  getExternalNetworks: getExternalNetworksEndpoint,
  getAvailableIpAddresses: getAvailableIpAddressesEndpoint,
  getEdgeClusters: getNsxtEdgeClustersEndpoint,
};
