/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function partialUploadEndpoint(options?: any) {
  return {
    method: 'put',
    resource: options.urlParams.fullAddress,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/octet-stream',
      ...options.headers,
    },
    additionalConfig: {
      maxRedirects: 0,
    },
  };
}

module.exports = partialUploadEndpoint;
