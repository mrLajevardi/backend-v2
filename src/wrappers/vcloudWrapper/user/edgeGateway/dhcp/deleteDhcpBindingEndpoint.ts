/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @return {Object}
 */
export function deleteDhcpBindingsEndpoint(options?: any) {
  return {
    method: 'delete',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      ...options.headers,
    },
  };
}
