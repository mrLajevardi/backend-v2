const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const config = require('../../vcdConfig').admin.org;
/**
 * @param {String} name
 * @param {String} authToken
 * @return {Promise}
 */
module.exports = async function createOrg(name, authToken) {
  const requestBody = {
    ...config,
    name: name,
    displayName: name,
  };
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: requestBody,

  };
  const response = await new VcloudWrapper().posts('admin.org.createOrg', options);
  return Promise.resolve({
    id: response.data.id,
    name: response.data.name,
    __vcloudTask: response.headers['location'],
  });
};
