const createOrg = require('./createOrg');
const createOrgCatalog = require('./createOrgCatalog');
const getOrg = require('./getOrg');
const deleteCatalogOrg = require('./deleteCatalog');

const adminOrgWrapper = {
  createOrg: createOrg,
  createOrgCatalog: createOrgCatalog,
  getOrg: getOrg,
  deleteCatalog: deleteCatalogOrg,
};

module.exports = adminOrgWrapper;
