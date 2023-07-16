/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function deleteFirewallEndpoint(options?: any) {
  return {
    method: 'delete',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules/${options.urlParams.ruleId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}
