/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function createEdgeGatewayEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/edgeGateways`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.1',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}
