/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @return {Object}
 */
export function createApplicationPortProfilesEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createApplicationPortProfilesEndpoint;
