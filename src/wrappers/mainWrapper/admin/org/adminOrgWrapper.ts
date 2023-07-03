import { createOrg } from './createOrg';
import { createOrgCatalog } from './createOrgCatalog';
import { getOrg } from './getOrg';
import { deleteCatalog } from './deleteCatalog';

export const adminOrgWrapper = {
  createOrg: createOrg,
  createOrgCatalog: createOrgCatalog,
  getOrg: getOrg,
  deleteCatalog: deleteCatalog,
};
