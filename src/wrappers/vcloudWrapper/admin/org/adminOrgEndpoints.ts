const createOrgCatalogEndpoint = require('./createOrgCatalogEndpoint');
const deleteOrgCatalogEndpoint = require('./deleteOrgCatalogEndpoint');
const createOrgEndpoint = require('./createOrgEndpoint');
const getOrgEndpoint = require('./getOrgEndpoint');

export const adminOrgEndpoints = {
  createOrg: createOrgEndpoint,
  createOrgCatalog: createOrgCatalogEndpoint,
  getOrg: getOrgEndpoint,
  deleteCatalog: deleteOrgCatalogEndpoint,
};

module.exports = adminOrgEndpoints;
