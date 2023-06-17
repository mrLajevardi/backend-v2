const getEdgeGatewayEndpoint = require('./getEdgeGatewayEndpoint');
const updateDnsForwarderEndpoint = require('./updateDnsForwarderEndpoint');
const getDnsForwarderEndpoint = require('./getDnsForwarderEndpoint');
const updateDhcpForwarderEndpoint = require('./updateDhcpForwarderEndpoint');
const getDhcpForwarderEndpoint = require('./getDhcpForwarderEndpoint');

const edgeGatewayEndpoints = {
  getEdgeGateway: getEdgeGatewayEndpoint,
  updateDnsForwarder: updateDnsForwarderEndpoint,
  getDnsForwarder: getDnsForwarderEndpoint,
  updateDhcpForwarder: updateDhcpForwarderEndpoint,
  getDhcpForwarder: getDhcpForwarderEndpoint,
};

module.exports = edgeGatewayEndpoints;
