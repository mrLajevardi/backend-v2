import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * create ip set
 * @param {String} authToken
 * @param {String} description
 * @param {String} name
 * @param {Array} ipAddresses
 * @param {String} edgeName
 * @return {Promise}
 */
export async function userCreateIPSet(
  authToken,
  description,
  name,
  ipAddresses,
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
  const options = {
    body: requestBody,
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const response = await new VcloudWrapper().posts(
    'user.ipSets.createIpSets',
    options,
  );
  return Promise.resolve({
    __vcloudTask: response.headers['location'],
  });
}
