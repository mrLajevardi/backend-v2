/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function vcloudQueryEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/api/query`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = vcloudQueryEndpoint;


