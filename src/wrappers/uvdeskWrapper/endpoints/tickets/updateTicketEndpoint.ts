/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.headers
 * @return {Object}
 */
function updateTicketEndpoint(options = {}) {
  return {
    method: 'patch',
    resource: `/ticket/${options.urlParams.ticketId}`,
    params: null,
    body: options.body,
    headers: options.headers,
  };
}

module.exports = updateTicketEndpoint;


