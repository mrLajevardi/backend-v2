/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function deleteIpSetsEndpoint(options? : any ) {
  return {
    method: 'delete',
    resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = deleteIpSetsEndpoint;


