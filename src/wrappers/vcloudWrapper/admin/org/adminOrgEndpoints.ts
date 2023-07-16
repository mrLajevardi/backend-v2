import { createOrgCatalogEndpoint } from './createOrgCatalogEndpoint';
import { deleteOrgCatalogEndpoint } from './deleteOrgCatalogEndpoint';
import { createOrgEndpoint } from './createOrgEndpoint';
import { getOrgEndpoint } from './getOrgEndpoint';

export const adminOrgEndpoints = {
  createOrg: createOrgEndpoint,
  createOrgCatalog: createOrgCatalogEndpoint,
  getOrg: getOrgEndpoint,
  deleteCatalog: deleteOrgCatalogEndpoint,
};
