import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * update all firewall rules
 * @param {String} authToken
 * @param {Object} config
 * @param {String} edgeName
 * @return {Promise}
 */
export async function userUpdateFirewallList(authToken, config, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const requestBody = {
    userDefinedRules: config,
  };
  const firewall = await new VcloudWrapper().posts(
    'user.firewall.updateFirewallList',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { gatewayId },
      body: requestBody,
    },
  );
  return Promise.resolve({
    __vcloudTask: firewall.headers['location'],
  });
}

module.exports = userUpdateFirewallList;
