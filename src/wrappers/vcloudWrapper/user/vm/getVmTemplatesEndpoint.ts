/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
function getVmTemplatesEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/api/vAppTemplate/${options.urlParams.vmId}`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = getVmTemplatesEndpoint;


