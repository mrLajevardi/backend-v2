/**
 * @param {Object} options
 * @param {Object} options.body
 * @param {Object} options.headers
 * @return {Object}
 */
export function createTicketEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/ticket`,
    params: null,
    body: options.body,
    headers: options.headers,
  };
}

module.exports = createTicketEndpoint;


