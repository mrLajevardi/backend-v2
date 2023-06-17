/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function getEdgeGatewayEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/edgeGateways`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = getEdgeGatewayEndpoint;


