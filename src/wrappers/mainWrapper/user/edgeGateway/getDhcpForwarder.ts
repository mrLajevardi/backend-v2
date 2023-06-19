import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
import { isEmpty } from 'class-validator';

/**
 * get dns forwarder lists
 * @param {String} authToken
 * @param {String} edgeName
 * @return {Promise}
 */

export async function getDhcpForwarder(authToken, edgeName) {
  const gateway = await getEdgeGateway(authToken);

  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;

  const dhcpForwarder = await new VcloudWrapper().posts(
    'user.edgeGateway.getDhcpForwarder',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { gatewayId },
    },
  );
  return Promise.resolve(dhcpForwarder.data);
}
module.exports = getDhcpForwarder;
