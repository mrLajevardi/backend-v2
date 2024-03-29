import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * deletes dhcp
 * @param {String} authToken
 * @param {String} networkId
 * @return {Promise}
 */
export async function userDeleteDhcp(authToken, networkId) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.deleteDhcp', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: {
      networkId,
    },
  });
  return Promise.resolve({
    __vcloudTask: dhcp.headers['location'],
  });
}
