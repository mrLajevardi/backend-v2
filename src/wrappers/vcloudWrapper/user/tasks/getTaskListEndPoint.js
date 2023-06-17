/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
function getTaskListEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/api/query`,
    params: {
      type: 'task',
      page: options.params.page,
      pageSize: options.params.pageSize,
      sortDesc: options.params.sortDesc,
    },
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json',
      ...options.headers,
    },
  };
}

module.exports = getTaskListEndpoint;
