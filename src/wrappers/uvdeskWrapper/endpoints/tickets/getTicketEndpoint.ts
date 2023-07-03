/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.headers
 * @return {Object}
 */
export function getTicketEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/ticket/${options.urlParams.ticketId}`,
    params: null,
    body: null,
    headers: options.headers,
  };
}

