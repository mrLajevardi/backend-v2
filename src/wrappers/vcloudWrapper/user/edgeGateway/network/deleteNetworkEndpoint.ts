/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
function deleteNetworkEndpoint(options = {}) {
  return {
    method: 'delete',
    resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = deleteNetworkEndpoint;
