/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
export function getListOfTicketsEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/tickets`,
    params: options.params,
    body: null,
    headers: options.headers,
  };
}

