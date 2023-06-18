/**
 * @param {Object} options
 * @param {Object} options.urlParams
 * @param {Object} options.headers
 * @return {Object}
 */
export function answerEndpoint(options? : any) {
  return {
    method: 'post',
    resource: `/api/vApp/${options.urlParams.vmId}/question/action/answer`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json',
      ...options.headers,
    },
  };
}

module.exports = answerEndpoint;


