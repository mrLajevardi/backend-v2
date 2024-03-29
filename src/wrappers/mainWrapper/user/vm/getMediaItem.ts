import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * get a single vm
 * @param {String} authToken
 * @param {String} vAppId
 * @return {Promise}
 */
export async function userGetMediaItem(authToken, mediaItemId) {
  const mediaItem = await new VcloudWrapper().posts('user.vm.getMediaItem', {
    urlParams: { mediaItemId },
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return mediaItem.data;
}
