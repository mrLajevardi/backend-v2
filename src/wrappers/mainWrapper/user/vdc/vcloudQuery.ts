import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {Object} params
 * @param {Object} additionalHeaders
 * @return {Promise}
 */
export async function vcloudQuery(
  authToken,
  params: any,
  additionalHeaders = {},
) {
  const options = {
    params,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...additionalHeaders,
    },
  };
  const response = await new VcloudWrapper().posts(
    'user.vdc.vcloudQuery',
    options,
  );
  return Promise.resolve(response);
}
