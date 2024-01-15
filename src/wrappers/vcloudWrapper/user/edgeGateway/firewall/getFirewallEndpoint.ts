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
      Accept: 'application/json;version=38.1',
      ...options.headers,
    },
  };
}
