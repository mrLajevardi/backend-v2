/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function attachNamedDisk(options? : any ) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmID}/disk/action/attach`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = attachNamedDisk;
