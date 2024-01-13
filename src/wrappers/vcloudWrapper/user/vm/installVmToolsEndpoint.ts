/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function installVmToolsEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/installVMwareTools`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
