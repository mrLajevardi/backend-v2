/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
function getListOfTicketsEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/tickets`,
    params: options.params,
    body: null,
    headers: options.headers,
  };
}

module.exports = getListOfTicketsEndpoint;

