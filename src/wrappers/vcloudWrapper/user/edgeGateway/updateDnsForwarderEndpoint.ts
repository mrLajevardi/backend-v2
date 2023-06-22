/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function updateDnsForwarderEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = updateDnsForwarderEndpoint;
