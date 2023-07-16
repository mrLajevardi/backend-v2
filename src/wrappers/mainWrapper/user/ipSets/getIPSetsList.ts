import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

import { isEmpty } from 'class-validator';
import { getEdgeGateway } from '../edgeGateway/getEdgeGateway';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @param {String} edgeName
 * @param {String} filter
 * @return {Promise}
 */
export async function userGetIPSetsList(
  authToken,
  page,
  pageSize,
  edgeName,
  filter = '',
) {
  const gateway = await getEdgeGateway(authToken);
  if (isEmpty(gateway.values[0])) {
    return Promise.reject(new NoIpIsAssignedException());
  }
  const gatewayId = gateway.values.filter((value) => value.name === edgeName)[0]
    .id;
  const response = await new VcloudWrapper().posts(
    'user.ipSets.getIpSetsList',
    {
      params: {
        page,
        pageSize,
        filter: `((ownerRef.id==${gatewayId};typeValue==IP_SET))` + filter,
        sortAsc: 'name',
      },
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return Promise.resolve(response.data);
}
