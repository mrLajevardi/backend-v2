/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
function getTaskEndpoint(options = {}) {
  return {
    method: 'get',
    resource: `/api/task/${options.urlParams.taskId}`,
    params: options.params,
    body: null,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}

module.exports = getTaskEndpoint;
