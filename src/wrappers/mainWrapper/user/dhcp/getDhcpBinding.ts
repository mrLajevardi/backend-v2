import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * gets a dhcp binding
 * @param {String} authToken
 * @param {String} networkId
 * @param {Number} bindingId
 * @return {Promise}
 */
export async function userGetDhcpBinding(authToken, networkId, bindingId) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.getDhcpBinding', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: {
      networkId,
      bindingId,
    },
  });
  return Promise.resolve(dhcp.data);
}
