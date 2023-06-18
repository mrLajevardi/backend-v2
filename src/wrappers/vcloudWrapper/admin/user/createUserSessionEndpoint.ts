/**
 * @param {Object} options
 * @param {Object} options.headers
 * @return {Object}
 */
export function createUserSessionEndpoint(options? : any ) {
  return {
    method: 'post',
    resource: `/cloudapi/1.0.0/sessions`,
    params: {},
    body: null,
    headers: {
      'Accept': 'application/json;version=38.0.0-alpha',
      ...options.headers,
    },
  };
}

module.exports = createUserSessionEndpoint;


