/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getDnsForwarderEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
