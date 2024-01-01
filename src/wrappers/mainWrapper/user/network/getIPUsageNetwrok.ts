import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get a list of networks
 * to get a single network use filter eg: id==<networkId>
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @param {Number} filter
 * @return {Promise}
 */
export async function getIPUsageNetwrok(
  authToken,
  page = 1,
  pageSize = 25,
  networkId,
) {
  const params = {
    page,
    pageSize,
  };

  const networks = await new VcloudWrapper().posts(
    'user.network.getNetworkIPUsageList',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { networkId },
      params,
    },
  );
  return Promise.resolve(networks.data);
}
