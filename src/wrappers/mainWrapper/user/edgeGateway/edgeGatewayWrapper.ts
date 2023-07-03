import { getEdgeGateway } from './getEdgeGateway';
import { updateDnsForwarder } from './updateDnsForwarder';
import { getDnsForwarder } from './getDnsForwarder';
import { updateDhcpForwarder } from './updateDhcpForwarder';
import { getDhcpForwarder } from './getDhcpForwarder';

export const edgeGatewayWrapper = {
  getEdgeGateway: getEdgeGateway,
  updateDnsForwarder: updateDnsForwarder,
  getDnsForwarder: getDnsForwarder,
  updateDhcpForwarder: updateDhcpForwarder,
  getDhcpForwarder: getDhcpForwarder,
};
