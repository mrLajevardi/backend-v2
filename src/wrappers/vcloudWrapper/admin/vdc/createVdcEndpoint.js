/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */
function createVdcEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/api/admin/org/${options.urlParams.orgId}/vdcsparams`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}

module.exports = createVdcEndpoint;


