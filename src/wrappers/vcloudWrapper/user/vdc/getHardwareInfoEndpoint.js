/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function getHardwareInfoEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/api/vdc/${options.urlParams.vdcId}/hwv/vmx-19`,
    params: options.params,
    body: null,
    headers: {
      'Content-Type': 'application/* +json;',
      'Accept': 'application/* +json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = getHardwareInfoEndpoint;


