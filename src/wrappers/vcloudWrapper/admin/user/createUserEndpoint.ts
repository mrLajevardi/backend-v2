/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @param {Object} options.params
 * @return {Object}
 */
export function createUserEndpoint(options?: any) {
  return {
    method: 'post',
    resource: `/api/admin/org/${options.urlParams.orgId}/users`,
    params: {},
    body: options.body,
    headers: {
      Accept: 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}
