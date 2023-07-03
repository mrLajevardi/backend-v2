/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function vmAttachedNamedDisk(options?: any) {
  return {
    method: 'get',
    resource: `/api/disk/${options.urlParams.nameDiskID}/attachedVms`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
