const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 * get a list of networks
 * to get a single network use filter eg: id==<networkId>
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @param {Number} filter
 * @return {Promise}
 */
export async function userGetNetwork(
  authToken,
  page = 1,
  pageSize = 25,
  filter = '',
) {
  const params = {
    page,
    pageSize,
    filter,
    filterEncoded: true,
  };
  const networks = await new VcloudWrapper().posts(
    'user.network.getNetworkList',
    {
      params,
      headers: { Authorization: `Bearer ${authToken}` },
    },
  );
  return Promise.resolve(networks.data);
}
module.exports = userGetNetwork;
