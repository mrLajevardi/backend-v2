/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.headers
 * @return {Object}
 */
export function questionEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/vApp/${options.urlParams.vmId}/question`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json',
      ...options.headers,
    },
  };
}
