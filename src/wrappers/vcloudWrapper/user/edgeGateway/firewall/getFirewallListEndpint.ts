/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getFirewallListEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules`,
    params: options.params,
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}
