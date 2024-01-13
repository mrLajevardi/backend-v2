/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
export function getTaskEndpoint(options?: any) {
  return {
    method: 'get',
    resource: `/api/task/${options.urlParams.taskId}`,
    params: options.params,
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
