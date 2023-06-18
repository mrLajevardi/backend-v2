/**
 * get a list of nat rules
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.params
 * @return {Object}
 */
export function getNatEndpoint(options? : any ) {
  return {
    method: 'get',
    // eslint-disable-next-line max-len
    resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules/${options.urlParams.natId}`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

module.exports = getNatEndpoint;


