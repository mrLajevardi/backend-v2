import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} vmId
 * @param {Object} networks
 * @param {Number} primaryNetworkConnectionIndex
 index of primary network connection in networks array
 * @return {Promise}
 */
export async function userUpdateNetworkSection(
  authToken,
  vmId,
  networks,
  primaryNetworkConnectionIndex,
) {
  networks = networks.map((network) => {
    return {
      ...network,
      ipType: 'IPV_4',
      secondaryIpAddress: null,
      secondaryIpType: null,
      externalIpAddress: null,
      secondaryIpAddressAllocationMode: 'NONE',
    };
  });
  const requestBody = {
    _type: 'NetworkConnectionSectionType',
    primaryNetworkConnectionIndex,
    networkConnection: networks,
  };
  const networkSection = await new VcloudWrapper().posts(
    'user.vm.updateNetworkSection',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId },
      body: requestBody,
    },
  );
  return Promise.resolve({
    __vcloudTask: networkSection.headers['location'],
  });
}

