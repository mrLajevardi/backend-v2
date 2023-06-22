/**
 * @param {Object} options
 * @param {Object} options.headers
 * @param {Object} options.urlParams
 * @param {Object} options.body
 * @param {Object} options.params
 * @return {Object}
 */

export function deleteOrgCatalogEndpoint(options?: any) {
  return {
    method: 'delete',
    resource: `/api/admin/catalog/${options.urlParams.catalogId}?recursive=true&force=true`,
    params: {},
    headers: {
      Accept: 'application/*+json;version=36.3',
      'Content-Type': 'application/*+json',
      ...options.headers,
    },
  };
}

module.exports = deleteOrgCatalogEndpoint;
