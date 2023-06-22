/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {String} options.body
 * @return {Object}
 */
export function undeployVmEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/undeploy`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = undeployVmEndpoint;
