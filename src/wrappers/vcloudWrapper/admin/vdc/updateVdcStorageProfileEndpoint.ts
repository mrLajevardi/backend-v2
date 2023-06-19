/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @param {Object} options.fullUrl
 * @return {Object}
 */
export function updateVdcStorageProfileEndpoint(options?: any) {
  return {
    method: 'put',
    resource: options.fullUrl,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}

module.exports = updateVdcStorageProfileEndpoint;
