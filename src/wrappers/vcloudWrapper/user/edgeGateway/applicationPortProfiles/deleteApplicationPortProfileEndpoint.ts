/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
function deleteApplicationPortProfilesEndpoint(options = {}) {
  return {
    method: 'delete',
    resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = deleteApplicationPortProfilesEndpoint;


