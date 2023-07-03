/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function uploadFileEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/catalog/${options.urlParams.catalogId}/action/upload`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/vnd.vmware.vcloud.media+json;charset=UTF-8',
      ...options.headers,
    },
  };
}
