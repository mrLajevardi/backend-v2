/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
export function createTemplateEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/catalog/${options.urlParams.catalogId}/action/captureVApp`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = createTemplateEndpoint;


