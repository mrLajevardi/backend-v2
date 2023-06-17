const createEdgeGateway = require('./createEdgeGateway');
const getAvailableIpAddresses = require('./getAvailableIpAddresses');
const getEdgeCluster = require('./getEdgeCluster');
const getExternalNetworks = require('./getExternalNetworks');

export const adminEdgeGatewayWrapper = {
  createEdgeGateway,
  getAvailableIpAddresses: getAvailableIpAddresses,
  getExternalNetworks: getExternalNetworks,
  getEdgeClusters: getEdgeCluster,

};
module.exports = adminEdgeGatewayWrapper;
