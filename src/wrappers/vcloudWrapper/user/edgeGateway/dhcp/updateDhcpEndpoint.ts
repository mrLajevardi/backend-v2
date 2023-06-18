/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @return {Object}
 */
export function updateDhcpEndpoint(options? : any ) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = updateDhcpEndpoint;


