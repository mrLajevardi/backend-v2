/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
function createOrgEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/orgs`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createOrgEndpoint;


