import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get a single vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userPartialUpload(authToken, fullAddress, data, header) {
  const file = await new VcloudWrapper().posts('user.vm.partialUpload', {
    urlParams: { fullAddress },
    headers: { Authorization: `Bearer ${authToken}`, ...header },
    body: data,
  });
  return file;
}
