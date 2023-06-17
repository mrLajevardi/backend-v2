const deleteFirewallEndpoint = require('./deleteFirewallEndpoint');
const getFirewallEndpoint = require('./getFirewallEndpoint');
const getFirewallListEndpoint = require('./getFirewallListEndpint');
const updateFirewallEndpoint = require('./updateFirewallEndpoint');
const updateFirewallListEndpoint = require('./updateFirewallListEndpoint');

const firewallEndpoints = {
  updateFirewallList: updateFirewallListEndpoint,
  updateFirewall: updateFirewallEndpoint,
  getFirewallList: getFirewallListEndpoint,
  getFirewall: getFirewallEndpoint,
  deleteFirewall: deleteFirewallEndpoint,
};

module.exports = firewallEndpoints;

