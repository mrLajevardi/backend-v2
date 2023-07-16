/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function disableVdcEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `api/admin/vdc/${options.urlParams.vdcId}/action/disable`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
