/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
function createIpSetsEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/firewallGroups`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createIpSetsEndpoint;


