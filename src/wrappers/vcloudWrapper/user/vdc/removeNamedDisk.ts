/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function removeNamedDisk(options? : any) {
  return {
    method: 'delete',
    resource: `/api/disk/${options.urlParams.nameDiskID}`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = removeNamedDisk;
