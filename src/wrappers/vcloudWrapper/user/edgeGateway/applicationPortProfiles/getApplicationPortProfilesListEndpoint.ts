/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function getApplicationPortProfilesListEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/cloudapi/1.0.0/applicationPortProfiles`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/json;version=38.1',
      ...options.headers,
    },
  };
}
