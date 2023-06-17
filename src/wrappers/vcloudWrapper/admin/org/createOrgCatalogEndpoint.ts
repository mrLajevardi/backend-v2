/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.body
 * @param {Object} options.urlParams
 * @return {Object}
 */
function createOrgCatalogEndpoint(options = {}) {
  return {
    method: 'post',
    resource: `/api/admin/org/${options.urlParams.orgId}/catalogs`,
    params: {},
    body: options.body,
    headers: {
      'Accept': 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}

module.exports = createOrgCatalogEndpoint;


