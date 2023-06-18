/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function updateApplicationPortProfilesEndpoint(options? : any ) {
  return {
    method: 'put',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = updateApplicationPortProfilesEndpoint;


