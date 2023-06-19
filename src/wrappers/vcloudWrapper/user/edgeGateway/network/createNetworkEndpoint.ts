/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function createNetworkEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/orgVdcNetworks`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = createNetworkEndpoint;
