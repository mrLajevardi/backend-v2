/**
 * @param {Object} options
 * @param {Object} options.params
 * @param {Object} options.headers
 * @return {Object}
 */
export function cancelTaskEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/task/${options.urlParams.taskId}/action/cancel`,
    params: {},
    body: null,
    headers: {
      Accept: 'application/* +json;version=38.1',
      'Content-Type': 'application/* +json;',
      ...options.headers,
    },
  };
}
