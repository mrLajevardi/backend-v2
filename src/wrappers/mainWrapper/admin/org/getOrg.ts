import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { vcdConfig } from '../../vcdConfig';
/**
 * @param {String} params
 * @param {String} authToken
 * @return {Promise}
 */
export async function getOrg(params, authToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    params,
  };
  const response = await new VcloudWrapper().posts('admin.org.getOrg', options);
  return Promise.resolve(response.data);
}

