import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get a single vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export function uploadFile(authToken, catalogId, data) {
  const response = new VcloudWrapper().posts('user.vm.uploadFile', {
    urlParams: { catalogId },
    headers: { Authorization: `Bearer ${authToken}` },
    body: data,
  });
  return response;
}
