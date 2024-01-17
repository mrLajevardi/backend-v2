/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.headers
 * @return {Object}
 */
export function updateTicketEndpoint(options?: any) {
  return {
    method: 'patch',
    resource: `/ticket/${options.urlParams.ticketId}`,
    params: null,
    body: options.body,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  };
}
