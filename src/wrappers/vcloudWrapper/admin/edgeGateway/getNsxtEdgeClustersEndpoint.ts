/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getNsxtEdgeClustersEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/nsxTResources/edgeClusters`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

