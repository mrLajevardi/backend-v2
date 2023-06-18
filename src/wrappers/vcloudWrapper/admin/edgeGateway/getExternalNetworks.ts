/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getExternalNetworksEndpoint(options? : any ) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/externalNetworks`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = getExternalNetworksEndpoint;


