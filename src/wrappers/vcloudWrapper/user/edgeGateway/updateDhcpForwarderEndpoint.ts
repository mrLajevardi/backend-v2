/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function updateDhcpForwarderEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dhcpForwarder`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
