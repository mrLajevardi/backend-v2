/**
 * @param {Object} options
 * @param {Object} options.headers
 * @return {Object}
 */
function createProviderSessionEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/sessions/provider`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createProviderSessionEndpoint;


