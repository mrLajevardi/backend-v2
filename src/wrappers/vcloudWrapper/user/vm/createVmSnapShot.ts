/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function createVmSnapShot(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/createSnapshot`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
