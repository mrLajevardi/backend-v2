const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
/**
 *
 * @param {String} authToken
 * @param {String} description
 * @param {String} name
 * @param {String} orgId
 * @return {Promise}
 */
async function createOrgCatalog(authToken, description, name = 'user-catalog', orgId) {
  const requestBody = {
    name,
    description,
  };
  const filteredOrgId = orgId.split('org:')[1];
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    urlParams: {orgId: filteredOrgId},
    body: requestBody,

  };
  await new VcloudWrapper().posts('admin.org.createOrgCatalog', options);
  return Promise.resolve();
};

module.exports = createOrgCatalog;

