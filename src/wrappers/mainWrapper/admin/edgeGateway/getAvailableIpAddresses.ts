import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

/**
 * get available ip addresses from vcloud
 * @param {String} externalNetworkId
 * @param {String} authToken
 */
export async function getAvailableIpAddresses(externalNetworkId, authToken) {
  const options = {
    urlParams: {
      externalNetworkId,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const availableIpAddressesList = await new VcloudWrapper().posts(
    'admin.edgeGateway.getAvailableIpAddresses',
    options,
  );
  return Promise.resolve(
    availableIpAddressesList.data.values[0]?.ipRanges?.values,
  );
}
module.exports = getAvailableIpAddresses;
