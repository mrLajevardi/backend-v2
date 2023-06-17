/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function resetVmEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/power/action/reset`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = resetVmEndpoint;


