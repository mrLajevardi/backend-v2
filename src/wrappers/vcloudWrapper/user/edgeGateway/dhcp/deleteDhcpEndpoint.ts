import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @return {Object}
 */
export function deleteDhcpEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
    params: {},
    body: null,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
