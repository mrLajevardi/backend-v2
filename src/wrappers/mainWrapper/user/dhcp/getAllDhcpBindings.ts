import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * gets a dhcp binding
 * @param {String} authToken
 * @param {String} networkId
 * @param {Number} pageSize
 * @param {String} cursor
 * @return {Promise}
 */
export async function userGetAllDhcpBindings(
  authToken,
  networkId,
  pageSize,
  cursor = '',
) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.getAllDhcpBindings', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: {
      networkId,
    },
    params: {
      pageSize,
      cursor,
    },
  });
  return Promise.resolve(dhcp);
}

module.exports = userGetAllDhcpBindings;
