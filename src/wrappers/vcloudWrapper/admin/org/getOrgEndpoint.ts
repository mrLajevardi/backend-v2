/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function getOrgEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/orgs`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = getOrgEndpoint;


