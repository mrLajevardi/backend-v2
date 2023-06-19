/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @return {Object}
 */
export function createDhcpBindingEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createDhcpBindingEndpoint;
