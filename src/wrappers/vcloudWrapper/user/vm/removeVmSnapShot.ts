/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function removeVmSnapShot(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/action/removeAllSnapshots`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}
