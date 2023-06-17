/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.headers
 * @return {Object}
 */
function replyTicketEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/ticket/${options.urlParams.ticketId}/thread`,
    params: null,
    body: options.body,
    headers: options.headers,
  };
}

module.exports = replyTicketEndpoint;


