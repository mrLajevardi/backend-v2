/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {String} options.body
 * @param {Object} options.params
 * @return {Object}
 */
export function instantiateVmFromTemplateEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/vdc/${options.urlParams.vdcId}/action/instantiateVmFromTemplate`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +xml;',
      ...options.headers,
    },
  };
}

module.exports = instantiateVmFromTemplateEndpoint;


