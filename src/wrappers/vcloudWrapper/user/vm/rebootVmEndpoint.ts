/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function rebootVmEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/power/action/reboot`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = rebootVmEndpoint;


