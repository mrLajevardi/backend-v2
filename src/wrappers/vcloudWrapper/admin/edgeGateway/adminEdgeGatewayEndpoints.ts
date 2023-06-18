const createEdgeGatewayEndpoint = require('./createEdgeGatewayEndpoint');
const getAvailableIpAddressesEndpoint = require('./getAvailableIpAddressesEndpoint');
const getExternalNetworksEndpoint = require('./getExternalNetworks');
const getNsxtEdgeClustersEndpoint = require('./getNsxtEdgeClustersEndpoint');

export const adminEdgeGatewayEndpoints = {
  createEdgeGateway: createEdgeGatewayEndpoint,
  getExternalNetworks: getExternalNetworksEndpoint,
  getAvailableIpAddresses: getAvailableIpAddressesEndpoint,
  getEdgeClusters: getNsxtEdgeClustersEndpoint,
};

module.exports = adminEdgeGatewayEndpoints;
