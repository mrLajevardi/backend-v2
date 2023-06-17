/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @return {Object}
 */
function deleteDhcpBindingsEndpoint(options = {}) {
  return {
    method: 'delete',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = deleteDhcpBindingsEndpoint;


