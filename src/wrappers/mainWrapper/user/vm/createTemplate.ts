import { isNil } from 'lodash';
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { createOrgCatalog } from '../../admin/org/createOrgCatalog';
import { vcloudQuery } from '../vdc/vcloudQuery';
/**
 * checks if user-catalog exists
 * @param {String} authToken
 * @return {Promise}
 */
export async function checkCatalog(authToken) {
  const catalogName = 'user-catalog';
  const queryOptions = {
    type: 'catalog',
    page: 1,
    pageSize: 15,
    sortAsc: 'name',
    filter: `name==${catalogName}`,
  };
  const catalogsList = await vcloudQuery(authToken, queryOptions);
  let catalogId = null;
  const catalogRecord = catalogsList?.data?.record;
  if (!isNil(catalogRecord) && catalogRecord[0]?.name === catalogName) {
    catalogId = catalogRecord[0].href.split('catalog/')[1];
  }
  return Promise.resolve(catalogId);
}
/**
 *
 * @param {String} authToken
 * @param {String} description
 * @param {String} name
 * @param {String} orgId
 * @param {String} containerId
 * @return {Promise}
 */
async function userCreateTemplate(
  authToken,
  description,
  name,
  orgId,
  containerId,
) {
  const check = await checkCatalog(authToken);
  let catalogId = check;
  if (isNil(check)) {
    await createOrgCatalog(authToken, '', 'user-catalog', orgId);
    catalogId = await checkCatalog(authToken);
  }
  const requestBody = {
    name,
    description,
    source: {
      href: `${VcloudWrapper.baseUrl}/api/vApp/${containerId}`,
    },
    customizeOnInstantiate: true,
  };
  const template = await new VcloudWrapper().posts('user.vm.createTemplate', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { catalogId },
    body: requestBody,
  });
  return Promise.resolve({
    __vcloudTask: template.headers['location'],
  });
}

module.exports = userCreateTemplate;
