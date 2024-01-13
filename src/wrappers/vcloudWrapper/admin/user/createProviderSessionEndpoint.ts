/**
 * @param {Object} options
 * @param {Object} options.headers
 * @return {Object}
 */
export function createProviderSessionEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/sessions/provider`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      ...options.headers,
    },
  };
}
