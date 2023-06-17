/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
function updateVAppTemplateEndpoint(options = {}) {
  return {
    method: 'put',
    resource: `api/vAppTemplate/${options.urlParams.templateId}`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = updateVAppTemplateEndpoint;


