import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
/**
 *
 * @param {String} authToken
 * @param {String} ruleId
 * @param {String} edgeName
 */
export async function userDeleteFirewall(authToken, ruleId, edgeName) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const firewall = await new VcloudWrapper().posts(
    'user.firewall.deleteFirewall',
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      urlParams: {
        gatewayId,
        ruleId,
      },
    },
  );
  return Promise.resolve({
    __vcloudTask: firewall.headers['location'],
  });
}
module.exports = userDeleteFirewall;
