/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
function updateGuestCustomizationEndpoint(options = {}) {
  return {
    method: 'put',
    resource: `/api/vApp/${options.urlParams.vmId}/guestCustomizationSection/`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = updateGuestCustomizationEndpoint;


