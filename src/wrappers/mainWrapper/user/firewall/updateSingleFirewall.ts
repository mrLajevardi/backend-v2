import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 *
 * @param {String} authToken
 * @param {String} ruleId
 * @param {Object} config
 * @param {String} edgeName
 * @return {Promise}
 */
export async function userUpdateSingleFirewall(
  authToken,
  ruleId,
  config,
  edgeName,
) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const firewall = await new VcloudWrapper().posts(
    'user.firewall.updateFirewall',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: {
        gatewayId,
        ruleId,
      },
      body: config,
    },
  );
  return Promise.resolve({
    __vcloudTask: firewall.headers['location'],
  });
}

module.exports = userUpdateSingleFirewall;
