
/**
 * gets network by given id
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getNetworkEndpoint(options? : any ) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/orgVdcNetworks`,
    params: {
      filter: `id==${options.urlParams.networkId}`,
    },
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = getNetworkEndpoint;


