const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * deletes dhcp
 * @param {String} authToken
 * @param {String} networkId
 * @param {String} bindingId
 * @return {Promise}
 */
export async function userDeleteDhcpBinding(authToken, networkId, bindingId) {
  const dhcp = await new VcloudWrapper().posts('user.dhcp.deleteDhcpBinding', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {
      networkId,
      bindingId,
    },
  });
  return Promise.resolve({
    __vcloudTask: dhcp.headers['location'],
  });
}

module.exports = userDeleteDhcpBinding;
