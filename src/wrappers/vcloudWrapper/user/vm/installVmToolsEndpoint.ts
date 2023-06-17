/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
function installVmToolsEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/installVMwareTools`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = installVmToolsEndpoint;


