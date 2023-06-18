/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {String} options.body
 * @return {Object}
 */
export function insertOrEjectEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/media/action/${options.urlParams.action}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = insertOrEjectEndpoint;


