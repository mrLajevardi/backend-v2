const userGetEdgeGateway = require('./getEdgeGateway');
const dnsForwarder = require('./updateDnsForwarder');
const dnsForwarderList = require('./getDnsForwarder');
const updateDhcpForwarder = require('./updateDhcpForwarder');
const getDhcpForwarder = require('./getDhcpForwarder');

export const edgeGatewayWrapper = {
  getEdgeGateway: userGetEdgeGateway,
  updateDnsForwarder: dnsForwarder,
  getDnsForwarder: dnsForwarderList,
  updateDhcpForwarder: updateDhcpForwarder,
  getDhcpForwarder: getDhcpForwarder,
};

module.exports = edgeGatewayWrapper;
