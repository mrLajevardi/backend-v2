import { deleteFirewallEndpoint } from './deleteFirewallEndpoint';
import { getFirewallEndpoint } from './getFirewallEndpoint';
import { getFirewallListEndpoint } from './getFirewallListEndpint';
import { updateFirewallEndpoint } from './updateFirewallEndpoint';
import { updateFirewallListEndpoint } from './updateFirewallListEndpoint';

export const firewallEndpoints = {
  updateFirewallList: updateFirewallListEndpoint,
  updateFirewall: updateFirewallEndpoint,
  getFirewallList: getFirewallListEndpoint,
  getFirewall: getFirewallEndpoint,
  deleteFirewall: deleteFirewallEndpoint,
};

module.exports = firewallEndpoints;
