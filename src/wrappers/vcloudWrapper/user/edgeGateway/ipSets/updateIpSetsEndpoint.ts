/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function updateIpSetsEndpoint(options? : any ) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = updateIpSetsEndpoint;


