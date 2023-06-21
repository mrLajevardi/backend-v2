/**
 * get a ip set by given id
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getIpSetsEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = getIpSetsEndpoint;
