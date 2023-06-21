import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get dhcp
 * @param {String} authToken
 * @param {String} networkId
 * @return {Promise}
 */
export async function userGetDhcp(authToken, networkId) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.getDhcp', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: {
      networkId,
    },
  });
  return Promise.resolve(dhcp.data);
}

module.exports = userGetDhcp;
