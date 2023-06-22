/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function updateNetworkSectionEndpoint(options?: any) {
  return {
    method: 'put',
    resource: `api/vApp/${options.urlParams.vmId}/networkConnectionSection/`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = updateNetworkSectionEndpoint;
