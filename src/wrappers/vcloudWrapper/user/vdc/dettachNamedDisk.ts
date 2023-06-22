/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function dettachNamedDisk(options?: any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmID}/disk/action/detach`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = dettachNamedDisk;
