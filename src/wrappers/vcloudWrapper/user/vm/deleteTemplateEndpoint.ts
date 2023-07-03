/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {String} options.body
 * @return {Object}
 */
export function deleteTemplateEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/api/vAppTemplate/${options.urlParams.templateId}`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
