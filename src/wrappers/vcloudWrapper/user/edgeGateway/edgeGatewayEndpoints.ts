import { getEdgeGatewayEndpoint } from './getEdgeGatewayEndpoint';
import { updateDnsForwarderEndpoint } from './updateDnsForwarderEndpoint';
import { getDnsForwarderEndpoint } from './getDnsForwarderEndpoint';
import { updateDhcpForwarderEndpoint } from './updateDhcpForwarderEndpoint';
import { getDhcpForwarderEndpoint } from './getDhcpForwarderEndpoint';

export const edgeGatewayEndpoints = {
  getEdgeGateway: getEdgeGatewayEndpoint,
  updateDnsForwarder: updateDnsForwarderEndpoint,
  getDnsForwarder: getDnsForwarderEndpoint,
  updateDhcpForwarder: updateDhcpForwarderEndpoint,
  getDhcpForwarder: getDhcpForwarderEndpoint,
};

module.exports = edgeGatewayEndpoints;
