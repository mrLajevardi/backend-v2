import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

/**
 * get external networks from vcloud this method is used to find uplink id
 * @param {String} authToken
 * @param {Number} page
 * @param {Number} pageSize
 * @return {Promise} return data of external networks
 */
export async function getExternalNetworks(authToken, page = 1, pageSize = 25) {
  const options = {
    params: {
      page,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const externalNetworks = await new VcloudWrapper().posts(
    'admin.edgeGateway.getExternalNetworks',
    options,
  );
  return Promise.resolve(externalNetworks.data);
}

module.exports = getExternalNetworks;
