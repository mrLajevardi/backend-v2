import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} description
 * @param {String} name
 * @param {String} ipAddresses
 * @param {String} ipSetId
 * @param {String} edgeName
 * @return {Promise}
 */
export async function userUpdateIPSet(
  authToken,
  description,
  name,
  ipAddresses,
  ipSetId,
  edgeName,
) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const requestBody = {
    name,
    description,
    ipAddresses,
    ownerRef: {
      id: gatewayId,
    },
    typeValue: 'IP_SET',
  };
  const ipSet = await new VcloudWrapper().posts('user.ipSets.updateIpSets', {
    urlParams: { ipSetId },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: requestBody,
  });
  return Promise.resolve({
    __vcloudTask: ipSet.headers['location'],
  });
}

module.exports = userUpdateIPSet;
