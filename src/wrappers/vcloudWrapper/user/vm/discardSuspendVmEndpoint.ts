/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function discardSuspendVmEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/discardSuspendedState`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = discardSuspendVmEndpoint;


