/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getEdgeGatewayEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/edgeGateways`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
