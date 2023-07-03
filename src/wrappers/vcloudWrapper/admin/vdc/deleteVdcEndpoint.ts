/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */

export function deleteVdcEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/api/admin/vdc/${options.urlParams.vdcId[0]}?force=true&recursive=true`,
    params: {},
    headers: {
      Accept: 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
