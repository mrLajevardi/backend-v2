/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function getAllDhcpBindingEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      ...options.headers,
    },
  };
}
