/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @return {Object}
 */
function deleteVmEndpoint(options = {}) {
  return {
    method: 'delete',
    resource: `/api/vApp/${options.urlParams.vmId}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = deleteVmEndpoint;


