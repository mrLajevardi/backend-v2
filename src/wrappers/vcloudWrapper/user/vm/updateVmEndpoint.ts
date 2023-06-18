/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function updateVmEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/reconfigureVm`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = updateVmEndpoint;


