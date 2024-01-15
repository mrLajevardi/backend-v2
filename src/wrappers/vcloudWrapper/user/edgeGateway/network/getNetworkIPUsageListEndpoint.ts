import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * gets network IP Usage by given id
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getNetworkIPUsageListEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/allocatedIpAddresses`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
