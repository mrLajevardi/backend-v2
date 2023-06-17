/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.headers
 * @return {Object}
 */
function getTicketEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/ticket/${options.urlParams.ticketId}`,
    params: null,
    body: null,
    headers: options.headers,
  };
}

module.exports = getTicketEndpoint;


