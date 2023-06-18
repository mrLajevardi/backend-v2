
/**
 * get a list of ip sets
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getIpSetsListEndpoint(options? : any ) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/firewallGroups/summaries`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = getIpSetsListEndpoint;


