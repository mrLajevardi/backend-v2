import { NoIpIsAssignedException } from "src/infrastructure/exceptions/no-ip-is-assigned.exception";

import { isEmpty } from "class-validator";
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * get a list of firewall rules
 * @param {String} authToken
 * @param {String} edgeName
 */
export async function userGetFirewallList(authToken, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0].id;
  const firewall = await new VcloudWrapper().posts('user.firewall.getFirewallList', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    urlParams: {gatewayId},
  });
  return Promise.resolve(firewall.data);
}

module.exports = userGetFirewallList;
