import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function updateFirewallListEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules`,
    params: {},
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
