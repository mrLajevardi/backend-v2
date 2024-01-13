/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function deleteMediaEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/api/media/${options.urlParams.mediaId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
