import { NoIpIsAssignedException } from "src/infrastructure/exceptions/no-ip-is-assigned.exception";

import { isEmpty } from "class-validator";
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const getEdgeGateway = require('../edgeGateway/getEdgeGateway');
/**
 * get a single firewall rule
 * @param {String} authToken
 * @param {String} ruleId
 * @param {String} edgeName
 * @return {Promise}
 */
export async function userGetSingleFirewall(authToken, ruleId, edgeName) {
  const gateway = await getEdgeGateway(authToken);

  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
      .id;

  if (ruleId === 'default_rule') {
    ruleId = '';
  }
  const firewall = await new VcloudWrapper().posts(
      'user.firewall.getFirewall',
      {
        headers: {Authorization: `Bearer ${authToken}`},
        urlParams: {
          gatewayId,
          ruleId,
        },
      },
  );
  if (ruleId === '') {
    return Promise.resolve(firewall.data.defaultRules[0]);
  }
  return Promise.resolve(firewall.data);
}

module.exports = userGetSingleFirewall;
