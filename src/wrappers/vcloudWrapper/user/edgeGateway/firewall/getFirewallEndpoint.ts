import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getFirewallEndpoint(options?: any) {
  return {
    method: 'get',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules/${options.urlParams.ruleId}`,
    params: options.params,
    body: options.body,
    headers: {
      Accept: getAccept(VcloudAcceptEnum.Json),
      ...options.headers,
    },
  };
}
