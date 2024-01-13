/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getVmEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/vApp/${options.urlParams.vmId}`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
