const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
import { vcdConfig } from "../../vcdConfig";
/**
 * @param {String} name
 * @param {String} authToken
 * @return {Promise}
 */
export  async function createOrg(name, authToken) {
  const requestBody = {
    ...vcdConfig.admin.org,
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
